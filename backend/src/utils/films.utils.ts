import { ITicket } from '../shared/entities/order.interface';

export function checkOccupiedSeats(
  takenSeats: string[], // формат "row:seat"
  tickets: ITicket[]
): boolean {
  console.log('🎫 checkOccupiedSeats called:');
  console.log('   Taken seats:', takenSeats);
  console.log('   Requested tickets:', tickets);
  
  for (const ticket of tickets) {
    const seatKey = `${ticket.row}:${ticket.seat}`;
    console.log(`   Checking seat: ${seatKey}`);
    
    if (takenSeats.includes(seatKey)) {
      console.log(`   ❌ Seat ${seatKey} is already taken!`);
      return false;
    }
    console.log(`   ✅ Seat ${seatKey} is available`);
  }
  
  console.log('   🎉 All seats are available!');
  return true;
}