import { Ticket } from 'src/repository/orders.schema';

export const checkOccupiedSeats: (
  taken: string[],
  tickets: Ticket[],
) => boolean = (taken, tickets) => {
  const newSeats = tickets.map((ticket: Ticket) => {
    return `${ticket.row}:${ticket.seat}`;
  });
  const filteredSeats = newSeats.filter((seat: string) => {
    return taken.indexOf(seat) !== -1;
  });

  return filteredSeats.length === 0;
};
