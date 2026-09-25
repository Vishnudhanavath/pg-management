import { RoomModal, type RoomModalProps } from './RoomModal';

export type RoomDrawerProps = RoomModalProps;
export const RoomDrawer: React.FC<RoomDrawerProps> = (props) => {
  return <RoomModal {...props} />;
};

export { RoomModal };
