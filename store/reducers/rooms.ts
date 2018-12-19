import { RoomState, Room, RoomDataAction } from '../../types/room';
import { RoomsActionType } from '../../types/enums/room';

const initialState: RoomState = {
  rooms: null,
  currentHour: null
};

export default function roomsReducer(state: RoomState = initialState, action: RoomDataAction): RoomState {
  const { type, payload } = action;

  if (type === RoomsActionType.SetRoomData) {
    return {
      ...state,
      rooms: payload as Array<Room>
    };
  }

  if (type === RoomsActionType.SetCurrentHour) {
    return {
      ...state,
      currentHour: payload as number
    };
  }

  return state;
}
