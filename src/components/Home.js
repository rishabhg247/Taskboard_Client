import React, { useEffect, useContext, useState } from 'react';
import { BiEditAlt,BiTrash} from "react-icons/bi";
import { TiDelete } from "react-icons/ti"; 
import { AuthContext } from "../context/authContext";
import axios from 'axios';

export default function Home() {

  const { currentUser,renderHome } = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [taskValues, setTaskValues] = useState({});
  const [activeListIndex, setActiveListIndex] = useState(0);
  const [editListName,setEditListName] = useState(false);
  const [listName,setListName] = useState(lists[activeListIndex]?.name||'');
  const [isDataSaved,setIsDataSaved]=useState(false);
  const [loading,setLoading]=useState(false);

  const handleCheckboxChange=(listIndex,taskIndex)=>{
    const updatedLists = [...lists];
    updatedLists[listIndex].tasks[taskIndex].completed = !updatedLists[listIndex].tasks[taskIndex].completed;
    setLists(updatedLists);
  };
  const deleteTask =(listIndex, taskIndex)=>{
    const tempList=[...lists];
    tempList[listIndex].tasks = tempList[listIndex].tasks.filter((_, I) => I !== taskIndex);
    setLists(tempList);
  }
  const addNewTask = (listIndex) => {
    if(taskValues[listIndex]===''||taskValues[listIndex]===undefined){alert('Please write your Task')}
    else{
      const newTask = { text:taskValues[listIndex], completed: false };
      const updatedLists = [...lists];
      updatedLists[listIndex].tasks.unshift(newTask);setLists(updatedLists)
      let tempObj={...taskValues};
      tempObj[listIndex]='';setTaskValues(tempObj)
    }
  };
  const addNewList =()=>{
    if(currentUser){let newList={name:`List ${lists.length+1}`,tasks:[]};setLists([...lists,newList])}
    else{setLists([]);alert("Please Login to create Lists")}
    
  };
  const handleDeleteList=(index)=>{let updatedLists=lists.filter((_,I)=>I!==index);setLists(updatedLists);};
  const handleEditListName=(index)=>{
    if(listName===''){alert('Please write list name');return}
    let tempList=[...lists]; tempList[index].name=listName;
    setLists(tempList);setEditListName(false)
  }
  const handleTaskInputChange = (index,value) => {setTaskValues(prev=>({...prev,[index]:value}))};

  async function handleData() {
    setLoading(true);
    let mainObj={username:currentUser.username,lists:lists}
    await axios
    .post('https://taskboard-server.vercel.app/api/lists',mainObj)
    .then((res) => {console.log(res.data);setLoading(false);setIsDataSaved(true)})
    .catch(err => {setLoading(false);setIsDataSaved(true);console.log(err)});
  }
  async function handleDataOnLogin(){
    setLoading(true);
    await axios
        .post('https://taskboard-server.vercel.app/api/data',{username:currentUser.username})
        .then((res) => {setLists(res.data);setLoading(false);setIsDataSaved(true)})
        .catch(err => {setLoading(false);setIsDataSaved(true);console.log(err)});
  }

  //functions to handle drag and drop...
  const handleDragStart = (e, fromListIndex, fromTaskIndex) => {
    e.dataTransfer.setData('text/plain', `${fromListIndex},${fromTaskIndex}`);
  };
  const handleDragOver = (e) => {e.preventDefault()};

  const handleDrop = (e, toListIndex, toTaskIndex) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const [fromListIndex, fromTaskIndex] = data.split(',');
    const updatedLists = [...lists];
    const taskToMove = updatedLists[fromListIndex].tasks[fromTaskIndex];
    // Remove task from the drag list
    updatedLists[fromListIndex].tasks.splice(fromTaskIndex, 1);
    // Handling when dropping onto the "No Tasks Available" area
    if (toTaskIndex === -1) {
      updatedLists[toListIndex].tasks.push(taskToMove);
    } else {
    // Add task to the drop list
      updatedLists[toListIndex].tasks.splice(toTaskIndex, 0, taskToMove);
    }
    updatedLists[toListIndex].tasks = updatedLists[toListIndex].tasks.filter(
      (item)=>item!==undefined && item!== null
    );setLists(updatedLists);
};

  useEffect(() => {
    if(currentUser){handleDataOnLogin()}
    else{setLists([])}
  }, [currentUser]);
  useEffect(()=>{
    localStorage.setItem("Lists", JSON.stringify(lists));
    setIsDataSaved(false)
  },[lists])
  useEffect(()=>{if(renderHome===true){setLists([])}},[renderHome])
  return (
    <div>
    <div className='flex overflow-x-auto  px-8 py-12 gap-4'>
      {lists.map((list, listIndex) => (
        <div key={listIndex} className='h-[60vh] min-w-[25%] rounded-md border-2 bg-sky-200  border-slate-300'>
            {editListName && activeListIndex === listIndex?
            <div className='flex justify-between text-lg font-semibold border-b border-slate-400 px-2'>
                <input type='text' value={listName} className='px-2 field' onChange={(e)=>{setListName(e.target.value)}}/>
                <button onClick={()=>{handleEditListName(listIndex)}} className='border border-slate-400 rounded-md px-3'>Save</button>
            </div>
            :
            <div className='flex justify-between text-lg font-semibold border-b border-slate-400 px-2'>
            <button onClick={()=>{setEditListName(true);setActiveListIndex(listIndex)}} className='border my-0.5 hover:text-yellow-500 border-slate-400 rounded-md px-1'><BiEditAlt/></button>
            <p>{list.name}</p>
            <button onClick={()=>{handleDeleteList(listIndex)}} className='border hover:text-red-500 border-slate-400 rounded-md my-0.5 px-1'><BiTrash/></button>
            </div>
            }
            
          
          <ul className='flex flex-col relative justify-center items-center px-1 py-2'
           onDragOver={(e) => handleDragOver(e)}
           onDrop={(e) => handleDrop(e, listIndex, -1)}>
          {list.tasks?.length === 0 ? (
              <li className="placeholder" >No Tasks Available</li>) : null}
            {list.tasks?.map((task, taskIndex) => (
              <div className='w-full'  key={taskIndex}>
              <li draggable
              onDragStart={(e) => handleDragStart(e, listIndex, taskIndex)}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, listIndex, taskIndex)}
              className='flex z-20 relative border-2 mx-0.5 my-[3px] hover:border-sky-800 rounded-md border-sky-500 items-center'>
              <input
                type='checkbox'
                checked={task?.completed}
                onChange={()=>handleCheckboxChange(listIndex,taskIndex)}
                className='flex-shrink-0  mx-2 my-1 w-5 h-5'
              />
              <span className={`text-lg font-medium ${task?.completed ? 'line-through' : null}`}>{task?.text}</span>
              <button onClick={()=>{deleteTask(listIndex,taskIndex)}} className='text-xl hover:text-red-500 absolute right-0'><TiDelete/></button>
              </li>
              </div>
            ))}
          </ul>
          
          <div className='px-1 flex gap-2 justify-between'>
          {activeListIndex===listIndex?
          <>
          <input
            type='text' value={taskValues[listIndex] || ''}
            onKeyDown={(e) => {if (e.key === 'Enter') {addNewTask(listIndex)}}}
            onChange={(e) => {handleTaskInputChange(listIndex, e.target.value)}}
            placeholder='Enter a new Task' onDragOver={(e) => {handleDragOver(e)}}
            className='border-2 px-4 rounded-md border-sky-700 text-lg font-semibold'
          />
          <button onClick={() => addNewTask(listIndex)} className='text-center rounded-md border-2 border-sky-800 w-full'>
            Add
          </button>
          </>
          :
          <button  className=' text-center rounded-md border-2 border-sky-800 w-full' onClick={()=>{setActiveListIndex(listIndex)}}>Add a Task</button>
          }
        </div>
          
          
        </div>
      ))}
      <div className='flex min-w-[25%]  rounded-md flex-col gap-6 items-center h-[145px] border-2 bg-sky-200  border-slate-300'>
        <p className='text-center w-full text-lg font-semibold  border-b border-slate-400'>Create new list</p>
        <button onClick={addNewList} className='text-[60px] text-sky-600 hover:text-sky-800 hover:border-sky-800 flex justify-center items-center border-sky-500 border-2 rounded-full w-16 h-16'>
          +
        </button>
      </div>
    </div>
    <div  className='flex justify-center'>
    {lists.length>0 && !isDataSaved &&loading===false?
    <button onClick={()=>{handleData()}} className='text-2xl text-white hover:font-bold hover:border-sky-700 bg-sky-500 hover:bg-white hover:text-sky-600  mt-4  font-semibold border-2 border-slate-600 px-6 py-0.5 rounded-md'>Save Data</button>
    :null
    }
    {loading?
    <button disabled={true} className='text-2xl text-white  bg-slate-400   mt-4  font-semibold border-2 border-slate-400 px-6 py-0.5 rounded-md'>loading..</button>:null
    }
    {isDataSaved?
    <button disabled={true} className='text-2xl text-white  bg-slate-400   mt-4  font-semibold border-2 border-slate-400 px-6 py-0.5 rounded-md'>Saved</button>:null}
    </div>
    
    </div>
  );
}
