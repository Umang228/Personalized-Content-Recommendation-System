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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
