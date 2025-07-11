type Ticket = {
    day: string;
    daytime: string;
    film: string;
    price: number;
    row: number;
    seat: number;
    session: string;
    time: string;
}

export type Order = {
    email: string;
    phone: string;
    tickets: Ticket[]
}


export type OrderResult = {
    total: number;
    items: (Ticket & {id: string})[];
}