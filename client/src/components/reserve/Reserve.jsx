import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState, useEffect } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useUser } from "../../context/UserContext.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RoomForm from "../roomForm/RoomForm.jsx";

const Reserve = ({ setOpen, hotelId }) => {
  const { user } = useUser();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const { data } = useFetch(`/api/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    console.log("Data fetched:", data);
  }, [data]);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());
    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/api/rooms/availability/${roomId}`, {
            dates: alldates,
          });
          return res.data;
        })
      );
      setOpen(false);
      navigate("/");
    } catch (err) { }
  };

  const handleManageRoomsClick = () => {
    setShowRoomForm(prev => !prev);
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const response = await axios.delete(`/api/rooms/${roomId}/${hotelId}`);
      if (response.status === 200) {
        console.log("Room deleted successfully!");
        setDatas(prevDatas => prevDatas.filter(room => room._id !== roomId));
      } else {
        console.error("Error deleting room:", response);
      }
    } catch (err) {
      console.error("Errore durante l'eliminazione della stanza:", err);
    }
  };

  const [editRoomId, setEditRoomId] = useState(null);
  const [roomToEdit, setRoomToEdit] = useState(null);

  const handleEditRoom = (roomId) => {
    const room = data.find((item) => item._id === roomId);
    setRoomToEdit(room);
    setEditRoomId(roomId);
  };

  const handleCloseEditRoom = () => {
    setEditRoomId(null);
    setRoomToEdit(null);
  };

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />

        {user && user.isAdmin && (
          <div>
            <button onClick={handleManageRoomsClick} className="manageRoomsButton">
              {showRoomForm ? "Hide Manage Rooms" : "Manage Rooms"}
            </button>
          </div>
        )}

        {editRoomId && roomToEdit && (
          <div className="admin-room-form">
            <h2>Edit Room</h2>
            <RoomForm
              hotelId={hotelId}
              roomId={editRoomId}
              roomToEdit={roomToEdit}
              handleClose={handleCloseEditRoom}
              isEdit={true}
            />
          </div>
        )}

        {showRoomForm && user && user.isAdmin && !editRoomId && (
          <div className="admin-room-form">
            <h2>Manage Rooms</h2>
            <RoomForm hotelId={hotelId} />
          </div>
        )}

        <span className="rSelectRooms"><b>Select your rooms:</b></span>
        {data && data.length > 0 ? (
          data.map((item) => (
            item && item.title && (
              <div className="rItem" key={item._id}>
                <div className="rItemInfo">
                  <div className="rTitle">
                    <span>{item.title}</span>
                    {user && user.isAdmin && (
                      <div className="room-actions">
                        <button onClick={() => handleEditRoom(item._id)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDeleteRoom(item._id)} className="delete-btn">Delete</button>
                      </div>
                    )}
                  </div>

                  <div className="rDesc">{item.desc}</div>
                  <div className="rMax">
                    Max people: <b>{item.maxPeople}</b>
                  </div>
                  <div className="rPrice">{item.price}€</div>
                </div>
                <div className="rSelectRooms">
                  {item.roomNumbers.map((roomNumber) => (
                    <div className="room" key={roomNumber._id}>
                      <label>{roomNumber.number}</label>
                      <input
                        type="checkbox"
                        value={roomNumber._id}
                        onChange={handleSelect}
                        disabled={!isAvailable(roomNumber)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )
          ))
        ) : (
          <p>No rooms available yet.</p>
        )}

        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
