document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'd918487841c66e9a1e9aec202ecf3d76';
    const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR&page=1`;

    function loadMovies() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const movies = data.results;
                const moviesContainer = document.getElementById('moviesRow');
                moviesContainer.innerHTML = '';

                movies.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('col-md-4', 'mb-4');
                    movieCard.innerHTML = `
                        <div class="card">
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                            <div class="card-body">
                                <h5 class="card-title">${movie.title}</h5>
                                <p class="card-text">${movie.overview.substring(0, 100)}...</p>
                                <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="btn btn-info">Saiba Mais</a>
                                <button class="btn btn-primary favoritar" data-id="${movie.id}">Favoritar</button>
                            </div>
                        </div>
                    `;
                    moviesContainer.appendChild(movieCard);

                    const favoriteButton = movieCard.querySelector('.favoritar');
                    favoriteButton.addEventListener('click', () => {
                        if (localStorage.getItem('isLoggedIn')) {
                            addFavorite(movie);
                        } else {
                            alert('Você precisa estar logado para favoritar filmes.');
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Erro ao carregar filmes:', error);
            });
    }

    function addFavorite(movie) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.find(fav => fav.id === movie.id)) {
            favorites.push(movie);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert('Filme adicionado aos favoritos!');
        } else {
            alert('Este filme já está nos favoritos!');
        }
    }

    function loadFavorites() {
        const favoritesContainer = document.getElementById('favoritesRow');
        favoritesContainer.innerHTML = '';
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p>Você não tem filmes favoritos ainda.</p>';
        } else {
            favorites.forEach(movie => {
                const favoriteCard = document.createElement('div');
                favoriteCard.classList.add('col-md-4', 'mb-4');
                favoriteCard.innerHTML = `
                    <div class="card">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <p class="card-text">${movie.overview.substring(0, 100)}...</p>
                            <button class="remove-favorite-btn" data-id="${movie.id}">Remover dos Favoritos</button>
                        </div>
                    </div>
                `;
                favoritesContainer.appendChild(favoriteCard);

                const removeButton = favoriteCard.querySelector('.remove-favorite-btn');
                removeButton.addEventListener('click', () => {
                    removeFavorite(movie.id);
                });
            });
        }
    }

    function removeFavorite(movieId) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.filter(fav => fav.id !== movieId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        loadFavorites(); // Recarrega a lista de favoritos após a remoção
    }

    function loginUser(email, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
        } else {
            alert('Email ou senha incorretos.');
        }
    }

    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        loginUser(email, password);
    });

    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Cadastro realizado com sucesso!');
    });

    document.getElementById('showFavorites').addEventListener('click', () => {
        loadFavorites();
        document.getElementById('moviesContainer').style.display = 'none';
        document.getElementById('favoritesContainer').style.display = 'block';
    });

    document.getElementById('showMovies').addEventListener('click', () => {
        document.getElementById('favoritesContainer').style.display = 'none';
        document.getElementById('moviesContainer').style.display = 'block';
    });

    loadMovies();
});
