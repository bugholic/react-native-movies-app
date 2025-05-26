import { Client, Databases, ID, Query } from 'react-native-appwrite'

const Database_id = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const Collection_id = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client)

export const updateSearchCount = async (query: string, movie: Movie) => {

    const result = await database.listDocuments(Database_id, Collection_id, [
        Query.equal('searchTerm', query)
    ])

    try {

        if (result.documents.length > 0) {
            const existingMovies = result.documents[0]

            await database.updateDocument(
                Database_id,
                Collection_id,
                existingMovies.$id,
                {
                    count: existingMovies.count + 1
                }
            )


        } else {
            await database.createDocument(
                Database_id,
                Collection_id,
                ID.unique(),
                {
                    title: movie.title,
                    searchTerm: query,
                    movie_id: movie.id,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                }
            )
        }
    } catch (error) {
        console.error(error)
        throw error
    }

}

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
    try {
        const result = await database.listDocuments(Database_id, Collection_id, [
            Query.limit(5),
            Query.orderDesc('count')
        ])

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.error(error)
        return [];
    }

}