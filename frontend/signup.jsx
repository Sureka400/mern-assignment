import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', form);
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  }

  return (
    <form onSubmit={submit}>
      <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" required />
      <input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" required />
      <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  )
}