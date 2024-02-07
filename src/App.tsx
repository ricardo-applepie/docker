import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import logo from './logo.svg';
import './App.css';

const backendUrl: string = "http://localhost:5000/job"; 

function App(): JSX.Element {
  const [reviews, setReviews] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string>(""); 
  const [formData, setFormData] = useState<{[key: string]: string | number}>({hours: 2}); 
  const [services, setServices] = useState<{service: string}[]>([{service: "loading ..."}]); 

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!formData.address) {
      setError("fill in address");
      return; 
    }; 
    setLoading(true)
    if(!formData.service) {
      formData["service"] = services[0].service; 
    }    

    const response = await fetch(backendUrl, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }); 
    setFormData({ address: "", hours: 2, services: ""}); 
    setLoading(false)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name; 
    const value = e.target.value; 
    setFormData({...formData, [name]: value})
  }

  const getServices = async () => {
    const response = await fetch("http://localhost:5000/services"); 
    const servicesJson = await response.json(); 
    console.log(servicesJson.services)
    setServices(servicesJson.services); 
  }

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value)
     setFormData({...formData, service: event.target.value});
  }

  useEffect(() => {
    getServices(); 
  }, [])

  const isDisabled = Object.keys(formData).every((i:string) => !!formData[i]); 

  return (
    <div className="App">
     <h1>Create job</h1>
      <form onSubmit={handleSubmit}>
          <label>
            Services:
            <select name="cars" id="cars" onChange={handleSelect}>
              {services.length > 0 && services.map((option: {service: string}, index: number) => {
                return <option key={index} value={option.service}>{option.service}</option>
              })}
            </select>
          </label>
          <br/>
        <label>
          Hours:
          <input type="number" name="hours" onChange={handleChange} value={formData["hours"] as number}/>
        </label>
                  <br/>
        <label>
          Address:
          <input type="text" name="address" onChange={handleChange} value={formData["address"] as string}/>
        </label>
        <button type="submit" disabled={!isDisabled}>create job</button>
      </form>
     {loading && "loading..."}
     {error && <span className="error">{error}</span>}
    </div>
  );
}

export default App;
