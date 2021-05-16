import { Link } from 'react-router-dom'

const About = ({ contact }) => {
    return (

        <div className='contact-info-container'>
            <h2>Hello!</h2>
            <h3>I am {contact.name}.</h3>
            <p>
                <span>This is a sample project made as part of learning react series. If you want to track some tasks, why don't you <Link to="/">go back</Link> and try the site.</span>
            </p>
        </div>
    )
}

export default About
