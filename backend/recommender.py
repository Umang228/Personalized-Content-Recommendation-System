import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds

class Recommender:
    def __init__(self, ratings, movies, k=50):
        self.ratings = ratings
        self.movies = movies
        self.k = k
        self.user_item_matrix = self._create_user_item_matrix()
        self.user_factors, self.sigma, self.item_factors = self._train_svd()
        
    def _create_user_item_matrix(self):
        matrix = self.ratings.pivot(index='user_id', columns='movie_id', values='rating')
        matrix = matrix.fillna(0)
        return matrix
    
    def _train_svd(self):
        # Normalize the matrix
        matrix = self.user_item_matrix.values
        user_ratings_mean = np.mean(matrix, axis=1)
        matrix_demeaned = matrix - user_ratings_mean.reshape(-1, 1)
        
        # Perform SVD
        U, sigma, Vt = svds(matrix_demeaned, k=self.k)
        sigma = np.diag(sigma)
        
        return U, sigma, Vt
    
    def get_recommendations(self, user_id, n=10):
        # Predict ratings
        user_idx = user_id - 1  # Adjust for 0-based indexing
        user_ratings_mean = np.mean(self.user_item_matrix.values, axis=1)
        pred_ratings = np.dot(np.dot(self.user_factors[user_idx, :], self.sigma), self.item_factors) + user_ratings_mean[user_idx]
        
        # Get top N recommendations
        movie_ids = self.user_item_matrix.columns
        rated_movies = self.ratings[self.ratings['user_id'] == user_id]['movie_id'].values
        recommendations = []
        
        for movie_idx in np.argsort(pred_ratings)[::-1]:
            movie_id = movie_ids[movie_idx]
            if movie_id not in rated_movies:
                movie_info = self.movies[self.movies['movie_id'] == movie_id]
                if not movie_info.empty:
                    genres = [col for col in movie_info.columns[5:] if movie_info[col].iloc[0] == 1]
                    recommendations.append({
                        'movie_id': int(movie_id),
                        'title': movie_info['title'].iloc[0],
                        'genres': genres
                    })
                if len(recommendations) >= n:
                    break
        
        return recommendations