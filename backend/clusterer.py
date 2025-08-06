import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import os

def clean_float(val):
    """Convert NaN or None to None, else to float."""
    try:
        if val is None:
            return None
        if isinstance(val, float) and np.isnan(val):
            return None
        return float(val)
    except Exception:
        return None

class UserClusterer:
    def __init__(self, ratings, movies, users, n_clusters=5):
        self.ratings = ratings
        self.movies = movies
        self.users = users
        self.n_clusters = n_clusters
        self.user_item_matrix = self._create_user_item_matrix()
        self.cluster_labels = None

    def _create_user_item_matrix(self):
        matrix = self.ratings.pivot(index='user_id', columns='movie_id', values='rating')
        matrix = matrix.fillna(0)
        return matrix

    def cluster_users(self):
        scaler = StandardScaler()
        matrix_scaled = scaler.fit_transform(self.user_item_matrix)
        kmeans = KMeans(n_clusters=self.n_clusters, random_state=42)
        self.cluster_labels = kmeans.fit_predict(matrix_scaled)
        return self.cluster_labels

    def analyze_clusters(self, output_dir='cluster_analysis'):
        if self.cluster_labels is None:
            raise ValueError("Run cluster_users() first to generate cluster labels.")
        os.makedirs(output_dir, exist_ok=True)
        users_with_clusters = self.users.copy()
        users_with_clusters['cluster'] = self.cluster_labels
        demographic_summary = []
        for cluster in range(self.n_clusters):
            cluster_users = users_with_clusters[users_with_clusters['cluster'] == cluster]
            age_mean = clean_float(cluster_users['age'].mean())
            age_std = clean_float(cluster_users['age'].std())
            gender_dist = cluster_users['gender'].value_counts(normalize=True).to_dict()
            gender_dist = {k: clean_float(v) for k, v in gender_dist.items()}
            occupation_dist = cluster_users['occupation'].value_counts(normalize=True).head(5).to_dict()
            occupation_dist = {k: clean_float(v) for k, v in occupation_dist.items()}
            demographic_summary.append({
                'cluster': cluster,
                'num_users': len(cluster_users),
                'age_mean': age_mean,
                'age_std': age_std,
                'gender_dist': gender_dist,
                'top_occupations': occupation_dist
            })
        genre_columns = self.movies.columns[5:]
        genre_summary = []
        ratings_with_movies = pd.merge(self.ratings, self.movies, on='movie_id')
        ratings_with_clusters = pd.merge(
            ratings_with_movies,
            users_with_clusters[['user_id', 'cluster']],
            on='user_id'
        )
        for cluster in range(self.n_clusters):
            cluster_ratings = ratings_with_clusters[ratings_with_clusters['cluster'] == cluster]
            genre_means = {}
            for genre in genre_columns:
                genre_ratings = cluster_ratings[cluster_ratings[genre] == 1]['rating']
                genre_means[genre] = clean_float(genre_ratings.mean())
            genre_summary.append({
                'cluster': cluster,
                'genre_preferences': genre_means
            })
        # Save as before (for your own reference, not required for the API)
        with open(os.path.join(output_dir, 'demographic_summary.txt'), 'w') as f:
            for summary in demographic_summary:
                f.write(f"Cluster {summary['cluster']}:\n")
                f.write(f"  Number of users: {summary['num_users']}\n")
                f.write(f"  Average age: {summary['age_mean']} (std: {summary['age_std']})\n")
                f.write(f"  Gender distribution: {summary['gender_dist']}\n")
                f.write(f"  Top occupations: {summary['top_occupations']}\n\n")
        genre_df = pd.DataFrame([s['genre_preferences'] for s in genre_summary])
        genre_df.insert(0, 'cluster', range(self.n_clusters))
        genre_df.to_csv(os.path.join(output_dir, 'genre_preferences.csv'), index=False)
        return demographic_summary, genre_summary
