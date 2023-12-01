import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./App.css"
import Footer from './Footer.js'
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
      const sortedData = res.data.sort((a, b) => a.name.localeCompare(b.name));
      const dataWithChecked = sortedData.map(item => ({ ...item, checked: false }));
      setData(dataWithChecked);
      setFilteredData(dataWithChecked);
    };
    fetchData();
  }, []);

  const debounce = (func, delay) => {
    let timer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  };

  const search = (term) => {
    const results = data.filter((item) =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(results);
  };

  const debouncedSearch = debounce(search, 300);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItemsSlice = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (id) => {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, checked: !item.checked };
        console.log(`Checkbox with ID ${id} is now ${updatedItem.checked ? 'checked' : 'unchecked'}`);
        return updatedItem;
      }
      return item;
    });

    setData(updatedData);
    setFilteredData(updatedData);
  };

  const handleGlobalCheckboxChange = (event) => {
    const isChecked = event.target.checked;

    const updatedData = data.map((item) => {
      if (currentItemsSlice.some((currentPageItem) => currentPageItem.id === item.id)) {
        return { ...item, checked: isChecked };
      }
      return item;
    });

    setData(updatedData);
    setFilteredData(updatedData);

    const updatedCurrentItems = currentItemsSlice.map((item) => {
      return { ...item, checked: isChecked };
    });

    setCurrentItems(updatedCurrentItems);
  };


  // delete Function implementation
  const handleDeleteSelectedItems = () => {
    const updatedData = data.filter((item) => !item.checked);
    setData(updatedData);
    setFilteredData(updatedData);
    setCurrentPage(1);

  };

  const handleDeleteUser = (userId) => {

    const updatedData = data.filter((item) => item.id !== userId);
    setData(updatedData);
    setFilteredData(updatedData);
  };

  //  edit function Implementation 
  const handleEditClick = (id) => {
    setEditMode(id);
  };

  const handleSaveClick = (id) => {
    setEditMode(null);

    const updatedData = data.map((item) => {
      if (item.id === id) {
        const editedName = document.getElementById(`name-${id}`).value;
        const editedRole = document.getElementById(`role-${id}`).value;

        return { ...item, name: editedName, role: editedRole };
      }
      return item;
    });

    setData(updatedData);
    setFilteredData(updatedData);
  };

  const handleCancelClick = () => {
    setEditMode(null);
  };
  const handleSearch = () => {
    debouncedSearch(searchTerm);
    setCurrentPage(1);
  }


  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            placeholder="Press Enter to Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
        <button className="delete-button" onClick={handleDeleteSelectedItems}>
          <DeleteForeverOutlinedIcon />
        </button>
      </div>
      <div className='table-container'>
        <div className='table-header'>
          <div className='checkbox-container'>
            <input
              type="checkbox"
              onChange={handleGlobalCheckboxChange}
            />
          </div>
          <div className='header-column'>Name</div>
          <div className='header-column'>Email</div>
          <div className='header-column'>Role</div>
          <div className='header-column'>Action</div>
        </div>
        {currentItemsSlice.map((item) => (
          <div key={item.id} className={`table-row ${item.checked ? 'checked' : ''}`}>
            <div className="checkbox-container">
              <input type='checkbox' onChange={() => handleCheckboxChange(item.id)} checked={item.checked} />
            </div>
            {editMode === item.id ? (
              <>
                <input type="text" id={`name-${item.id}`} defaultValue={item.name} className="row-column" />
                <input type="text" id={`role-${item.id}`} defaultValue={item.email} className="row-column" />
                <input type="text" id={`role-${item.id}`} defaultValue={item.role} className="row-column" />
                <div className="row-column">
                  <button className="btn" onClick={() => handleSaveClick(item.id)} style={{ "backgroundColor": "#42f557" }}><CheckOutlinedIcon /></button>
                  <button className="btn" onClick={handleCancelClick} style={{ "backgroundColor": "#ff4d4d" }}><CancelOutlinedIcon /></button>
                </div>
              </>
            ) : (
              <>
                <div className="row-column">{item.name}</div>
                <div className="row-column">{item.email}</div>
                <div className="row-column">{item.role}</div>
                <div className="row-column">
                  <button className="btn" onClick={() => handleEditClick(item.id)} style={{ "backgroundColor": "white" }}><EditNoteIcon /></button>
                  <button className="btn" style={{ "backgroundColor": "#ff4d4d" }} onClick={() => (handleDeleteUser(item.id))}><DeleteIcon /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      <Footer
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        totalRows={filteredData.length}
        checkedRows={filteredData.filter(item => item.checked).length}
      />
    </>
  );
}

export default App;




