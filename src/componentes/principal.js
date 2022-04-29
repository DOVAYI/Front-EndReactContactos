import React, { useEffect, useState } from 'react';
import './css/style.css';
import EditTodo from './EditTodo';
import DelTodo from './DelTodo';
import imgheader from './img/headerlogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCancel } from '@fortawesome/free-solid-svg-icons';
//import SaveTodo from './saveTodo';


const Principal = () => {

    const [todos, setTodos] = useState([]);
    const [name, setName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [born, setBorn] = useState('');
    const [status, setStatus] = useState('activado');
    const [error, setError] = useState('');
    let [btnActivo, setBtnActivo] = useState(false);
    let contador = 0;


    const validarCampos = (e) => {

        if (name === null || name === "") {
            setError("Se requiere el Nombre del Contacto");

        } else if (telephone === null || telephone === "") {
            setError("Se requiere el Telefóno del Contacto");

        } else if (email === null || email === "") {
            setError("Se requiere el Correo del Contacto");

        } else if (born === null || born === "") {
            setError("Se requiere Fecha Nacimiento del Contacto");

        } else {
            setError(" ");
            setBtnActivo(true);
            guardarTodo(e);
        }

    }




    //con este metodo inserti registros   <DelTodo todo={todo} />    
    //
    //<EditTodo todo={todo} />
    const guardarTodo = async (e) => {

        e.preventDefault();

        try {

            const body = { name, telephone, email, born, status }

            await fetch("http://localhost:8080/contact", {
                method: "POST",
                headers: { "content-type": 'application/json' },
                body: JSON.stringify(body),

            }).then((res) => {

                getTodos();
                limpiarCampos();
                setBtnActivo(false);
            }).catch(err => console.log(err))

        } catch (err) {
            console.error(err.message);
        }

    }




    const getTodos = async () => {

        try {
            const response = await fetch("http://localhost:8080/contact/contacts");
            const jsonData = await response.json();

            setTodos(jsonData);

        } catch (err) {
            console.error(err.message);
        }

    }



    const limpiarCampos = () => {

        setName('');
        setTelephone('');
        setEmail('');
        setBorn('');

    }



    useEffect(() => {

        getTodos();

    }, [contador]);



    return (

        <>
            <nav className="navbar navbar-expand-sm bg-primary navbar-light">
                <div className="logo">
                    <img alt="" src={imgheader} />
                </div>
                <div className="nav-bar">
                    <div className="menus row">

                    </div>
                </div>
            </nav>
            <br />
            <div className="container">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Guardar nuevo Producto</h5>
                    </div>
                    <div className="modal-body ">
                        <div className="container">
                            <div className="row">
                                <div className="col-2"><label>Nombre</label>
                                    <input type="text" value={name} onChange={e => setName((e.target.value))} /><label>Telefóno</label>
                                    <input type="text" value={telephone} onChange={e => setTelephone(e.target.value)} />
                                </div>
                                <div className="col-6">{error}</div>
                                <div className="col-2">
                                    <label>Correo Electrónico</label>
                                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                                    <label>Fecha Nacimiento</label>
                                    <input type="date" value={born} onChange={e => setBorn(e.target.value)} />
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" id="btnSave" className="btn btn-success" onClick={e => validarCampos(e)} disabled={btnActivo}><FontAwesomeIcon icon={faSave} />Guardar</button>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><FontAwesomeIcon icon={faCancel} />Cancelar</button>

                    </div>
                </div>
                <br />
                <table className="table" id="tabla">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre</th>
                            <th scope="col">Telefóno</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Nacimiento</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            todos.map(todo => (

                                <tr key={todo.id}>
                                    <td>{todo.id}</td>
                                    <td>{todo.name}</td>
                                    <td>{todo.telephone}</td>
                                    <td>{todo.email}</td>
                                    <td>{todo.born}</td>
                                    <td>

                                    </td>
                                    <td>

                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Principal;
