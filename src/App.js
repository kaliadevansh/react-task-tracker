import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import About from './components/About'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  const [contactInfo, setContactInfo] = useState({});
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    const getContactInfo = async() => {
      const contactInfoFromServer = await fetchContactInfo()
      setContactInfo(contactInfoFromServer)
    }
    getTasks()
    getContactInfo()
  }, [])

  // Fetch Tasks from db
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

  // Fetch Task from db
  const fetchTask = async (id) => {
    const fetchTaskPromise = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await fetchTaskPromise.json()
    return data
  }
  
  // Fetch contact info from db
  const fetchContactInfo = async() => {
    const contactInfoPromise = await fetch('http://localhost:5000/contact')
    const contactData = await contactInfoPromise.json()
    return contactData
  } 

  // Add Task
  const addTask = async (task) => {
    const addResponsePromise = await fetch(`http://localhost:5000/tasks`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task),
    })
    const data = await addResponsePromise.json()
    setTasks([...tasks, data])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }

  // Toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    taskToToggle.reminder = !taskToToggle.reminder
    const togglePromise = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(taskToToggle)
    })

    const updatedData = await togglePromise.json()

    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: updatedData.reminder } : task))
  }

  return (
    <Router>
      <div className='container'>
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        <Route path='/' exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask} />}
            {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : "You're done"}
          </>
        )}>
        </Route>
        <Route path='/about' component={() => (<About contact={contactInfo}/>)} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
