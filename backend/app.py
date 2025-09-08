from flask import Flask, jsonify, request
from flask_cors import CORS
from recommender import Recommender
from data_loader import load_data
from clusterer import UserClusterer
import os
import numpy as np

app = Flask(__name__)
CORS(app)

def clean_float(val):
    try:
        if val is None:
            return None
        if isinstance(val, float) and np.isnan(val):
            return None
        return float(val)
    except Exception:
        return None

# Load data
data_path = os.path.join(os.path.dirname(__file__), '../data')
data = load_data(data_path)
ratings = data['ratings']
movies = data['movies']
users = data['users']

recommender = Recommender(ratings, movies)
clusterer = UserClusterer(ratings, movies, users, n_clusters=5)
cluster_labels = clusterer.cluster_users()
demographic_summary, genre_summary = clusterer.analyze_clusters()

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        return jsonify(users.to_dict('records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommend/<int:user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        recommendations = recommender.get_recommendations(user_id, n=10)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clusters', methods=['GET'])
def get_clusters():
    try:
        clusters = []
        for i in range(len(demographic_summary)):
            cluster_data = demographic_summary[i].copy()
            # Sanitize genre preferences using clean_float, drop missing/0s
            genre_prefs = [
                {'name': genre, 'value': clean_float(value)}
                for genre, value in genre_summary[i]['genre_preferences'].items()
                if clean_float(value) is not None and clean_float(value) > 0
            ]
            cluster_data['genre_preferences'] = genre_prefs
            # Also sanitize top-level stats and distributions
            cluster_data['age_mean'] = clean_float(cluster_data.get('age_mean'))
            cluster_data['age_std'] = clean_float(cluster_data.get('age_std'))
            cluster_data['gender_dist'] = {k: clean_float(v) for k, v in cluster_data['gender_dist'].items()}
            cluster_data['top_occupations'] = {k: clean_float(v) for k, v in cluster_data['top_occupations'].items()}
            clusters.append(cluster_data)
        return jsonify(clusters)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/popular-movies', methods=['GET'])
def get_popular_movies():
    try:
        # Get query parameters
        sort_by = request.args.get('sort_by', 'rating_count')  # 'rating_count', 'avg_rating', 'weighted_score'
        limit = int(request.args.get('limit', 20))
        min_ratings = int(request.args.get('min_ratings', 10))  # Minimum number of ratings to be considered
        
        # Calculate movie statistics
        movie_stats = ratings.groupby('movie_id').agg({
            'rating': ['count', 'mean', 'std']
        }).reset_index()
        
        # Flatten column names
        movie_stats.columns = ['movie_id', 'rating_count', 'avg_rating', 'rating_std']
        movie_stats['rating_std'] = movie_stats['rating_std'].fillna(0)
        
        # Filter movies with minimum number of ratings
        movie_stats = movie_stats[movie_stats['rating_count'] >= min_ratings]
        
        # Calculate weighted score (Bayesian average)
        # Uses the formula: (v * R + m * C) / (v + m)
        # where v = number of ratings, R = average rating, m = minimum votes, C = mean rating across all movies
        global_mean_rating = ratings['rating'].mean()
        movie_stats['weighted_score'] = (
            (movie_stats['rating_count'] * movie_stats['avg_rating'] + min_ratings * global_mean_rating) /
            (movie_stats['rating_count'] + min_ratings)
        )
        
        # Sort based on the requested criteria
        if sort_by == 'avg_rating':
            movie_stats = movie_stats.sort_values('avg_rating', ascending=False)
        elif sort_by == 'weighted_score':
            movie_stats = movie_stats.sort_values('weighted_score', ascending=False)
        else:  # default to rating_count
            movie_stats = movie_stats.sort_values('rating_count', ascending=False)
        
        # Get top movies
        top_movies = movie_stats.head(limit)
        
        # Join with movie information
        popular_movies = []
        for _, movie_stat in top_movies.iterrows():
            movie_info = movies[movies['movie_id'] == movie_stat['movie_id']]
            if not movie_info.empty:
                movie_row = movie_info.iloc[0]
                genres = [col for col in movie_info.columns[5:] if movie_row[col] == 1]
                popular_movies.append({
                    'movie_id': int(movie_stat['movie_id']),
                    'title': movie_row['title'],
                    'genres': genres,
                    'rating_count': int(movie_stat['rating_count']),
                    'avg_rating': clean_float(movie_stat['avg_rating']),
                    'weighted_score': clean_float(movie_stat['weighted_score']),
                    'release_date': movie_row.get('release_date', '')
                })
        
        return jsonify({
            'movies': popular_movies,
            'sort_by': sort_by,
            'total_movies': len(movie_stats),
            'global_mean_rating': clean_float(global_mean_rating)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    app.run(debug=debug, host=host, port=port)
