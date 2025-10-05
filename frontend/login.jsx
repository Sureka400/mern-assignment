import React, { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' });
  const { login } = useContext(AuthContext);
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.token, data.user);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login error');
    }
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <button type="submit">Login</button>
    </form>
  );
}