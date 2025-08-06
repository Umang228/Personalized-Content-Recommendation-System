import pandas as pd
import os

def load_data(data_path):
    """
    Load all data files from the MovieLens 100K dataset.
    
    Args:
        data_path (str): Path to the directory containing the dataset files.
        
    Returns:
        dict: Dictionary containing DataFrames and lists for all data files.
    """
    # Load ratings (u.data)
    ratings = pd.read_csv(
        os.path.join(data_path, 'u.data'),
        sep='\t',
        names=['user_id', 'movie_id', 'rating', 'timestamp'],
        encoding='latin-1'
    )
    
    # Load movies (u.item)
    movies = pd.read_csv(
        os.path.join(data_path, 'u.item'),
        sep='|',
        encoding='latin-1',
        names=[
            'movie_id', 'title', 'release_date', 'video_release_date', 'imdb_url',
            'unknown', 'Action', 'Adventure', 'Animation', 'Children', 'Comedy',
            'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror',
            'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'
        ]
    )
    
    # Load users (u.user)
    users = pd.read_csv(
        os.path.join(data_path, 'u.user'),
        sep='|',
        encoding='latin-1',
        names=['user_id', 'age', 'gender', 'occupation', 'zip_code']
    )
    
    # Load info (u.info)
    with open(os.path.join(data_path, 'u.info'), 'r') as f:
        info = f.readlines()
    info = [line.strip() for line in info]
    
    # Load genres (u.genre)
    genres = pd.read_csv(
        os.path.join(data_path, 'u.genre'),
        sep='|',
        encoding='latin-1',
        names=['genre', 'index']
    )
    
    # Load occupations (u.occupation)
    with open(os.path.join(data_path, 'u.occupation'), 'r') as f:
        occupations = [line.strip() for line in f]
    
    # Load training/test splits
    splits = {}
    for i in range(1, 6):
        splits[f'u{i}.base'] = pd.read_csv(
            os.path.join(data_path, f'u{i}.base'),
            sep='\t',
            encoding='latin-1',
            names=['user_id', 'movie_id', 'rating', 'timestamp']
        )
        splits[f'u{i}.test'] = pd.read_csv(
            os.path.join(data_path, f'u{i}.test'),
            sep='\t',
            encoding='latin-1',
            names=['user_id', 'movie_id', 'rating', 'timestamp']
        )
    
    for split in ['ua.base', 'ua.test', 'ub.base', 'ub.test']:
        splits[split] = pd.read_csv(
            os.path.join(data_path, split),
            sep='\t',
            encoding='latin-1',
            names=['user_id', 'movie_id', 'rating', 'timestamp']
        )
    
    return {
        'ratings': ratings,
        'movies': movies,
        'users': users,
        'info': info,
        'genres': genres,
        'occupations': occupations,
        'splits': splits
    }