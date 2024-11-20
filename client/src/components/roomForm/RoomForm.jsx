import './roomForm.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const RoomForm = ({ hotelId, roomId }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    price: '',
    maxPeople: '',
    roomNumbers: [{ number: '', unavailableDates: [] }], 
  });
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(null);
  const [roomToEdit, setRoomToEdit] = useState(null);

  useEffect(() => {
    if (roomId) {
      axios.get(`/api/rooms/${roomId}`)
        .then((response) => {
          const roomData = response.data;
          setFormData({
            ...roomData,
            roomNumbers: Array.isArray(roomData.roomNumbers) ? roomData.roomNumbers : [{ number: '', unavailableDates: [] }],
          });
          setRoom(roomData);
        })
        .catch((err) => {
          console.error(err);
          setError("Error fetching room data");
        });
    }
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoomNumberChange = (index, e) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedRoomNumbers = [...prev.roomNumbers];
      updatedRoomNumbers[index] = { ...updatedRoomNumbers[index], number: value };
      return { ...prev, roomNumbers: updatedRoomNumbers };
    });
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();

    if (!user || !user.isAdmin) {
      setError('You must be an admin to manage rooms.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You need to be logged in.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const roomData = { ...formData };

    if (roomId) {
      console.log("Updating room with ID:", roomId);
      axios.put(`/api/rooms/${roomId}`, roomData, { headers })
        .then((response) => {
          console.log('Room updated successfully', response.data);
          axios.get(`/api/rooms/${roomId}`)
            .then((updatedRoomResponse) => {
              console.log('Updated room:', updatedRoomResponse.data);
              setRoomToEdit(updatedRoomResponse.data);
              navigate(`/hotels/${hotelId}`);
            })
            .catch((err) => {
              console.error("Error fetching updated room:", err);
              setError("Error fetching updated room");
            });
        })
        .catch((err) => {
          console.error("Error in updating room:", err);
          setError("Error updating room");
        });
    } else {
      console.log("Creating room for hotel with ID:", hotelId);
      axios.post(`/api/rooms/${hotelId}`, roomData, { headers })
        .then((response) => {
          console.log('Room created successfully', response.data);
          navigate(`/hotels/${hotelId}`);
        })
        .catch((err) => {
          console.error("Error creating room:", err);
          setError("Error creating room");
        });
    }
  };

  const handleDeleteRoom = () => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You need to be logged in to delete a room.');
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios.delete(`/api/rooms/${roomId}/${hotelId}`, { headers })
        .then((response) => {
          console.log('Room deleted successfully');
          navigate(`/hotels/${hotelId}`);
        })
        .catch((err) => {
          console.error(err);
          setError("Error deleting room");
        });
    }
  };

  return (
    <form onSubmit={handleRoomSubmit} className="rForm">
      <h1 className='roomTitle'>{roomId ? 'Edit Room' : 'Create Room'}</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          name="desc"
          value={formData.desc}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Max People:</label>
        <input
          type="number"
          name="maxPeople"
          value={formData.maxPeople}
          onChange={handleChange}
          required
        />
      </div>

      {formData.roomNumbers.map((roomNumber, index) => (
        <div key={index}>
          <label>Room Number:</label>
          <input
            type="text"
            name="number"
            value={roomNumber.number}
            onChange={(e) => handleRoomNumberChange(index, e)}
            required
          />
        </div>
      ))}

      <button type="submit">
        {roomId ? 'Update Room' : 'Create Room'}
      </button>
    </form>
  );
};

export default RoomForm;
