Movie Recommender System
A personalized movie recommendation system using the MovieLens 100k dataset. Built with Python (Flask) for the backend and React with Tailwind CSS for the frontend.
Dataset

MovieLens 100k dataset: 100,000 ratings from 943 users on 1682 movies.
Citation: F. Maxwell Harper and Joseph A. Konstan. 2015. The MovieLens Datasets: History and Context. ACM Transactions on Interactive Intelligent Systems (TiiS) 5, 4, Article 19 (December 2015). DOI: http://dx.doi.org/10.1145/2827872

Setup Instructions

Clone the Repository:
git clone <your-repo-url>
cd movie_recommender


Move MovieLens Files:Place the MovieLens 100k files (u.data, u.item, u.user, etc.) in the data/ folder.

Backend Setup:
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py


Frontend Setup:
cd frontend
npm install
npm start


Access the Application:Open http://localhost:5173 in your browser.


Features

Select a user to view personalized movie recommendations.
Displays movie titles and genres.
Uses SVD-based collaborative filtering for recommendations.

Folder Structure
movie_recommender/
├── data/                # MovieLens dataset files
├── backend/             # Flask backend
├── frontend/            # React frontend
└── README.md
