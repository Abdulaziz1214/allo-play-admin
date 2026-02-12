import React from 'react'
import Card from '../../components/ui/Card'

const MoviesListPage = () => {
    return (
        <div>
            <Card>
                <h1 className="text-2xl font-semibold">Movies</h1>
                <p className="text-sm text-[var(--muted)] mt-2">
                    Здесь будет таблица фильмов (poster, title, year, genres, rating, status).
                </p>
            </Card>
        </div>
    )
}

export default MoviesListPage
