export type Film = {
    "id": string;
    "rating": number;
    "director": string;
    "tags": string[];
    "title": string;
    "about": string;
    "description": string;
    "image": string;
    "cover": string;
}

export type FilmSchedule = {
    "id": string;
    "daytime": string;
    "hall": string;
    "rows": number;
    "seats": number;
    "price": number;
    "taken": string[];
}[]