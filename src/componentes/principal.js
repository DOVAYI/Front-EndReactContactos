import React, { useEffect, useState } from 'react';
import './css/style.css';
import imgheader from './img/headerlogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCancel, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import validateEmail from './validator/validatorEmail';


const Principal = () => {

    const [todos, setTodos] = useState([]);
    const [name, setName] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [born, setBorn] = useState('');
    //const [status2,setStatus2]=useState('activado');
    const [status,setStatus]=useState('activado');
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');
    let [btnActivo, setBtnActivo] = useState(false);
    let contador = 0;




    const validarCampos = (e, id) => {

        if (name === null || name === "") {
            setError("Se requiere el Nombre del Contacto");

        } else if (telephone === null || telephone === "") {
            setError("Se requiere el Telefóno del Contacto");

        } else if (email === null || email === "") {
            setError("Se requiere el Correo del Contacto");

        } else if (born === null || born === "") {
            setError("Se requiere Fecha Nacimiento del Contacto");

        } else {
            let option = validateEmail(email);
            if (option) {
                if (id === null || id === "") {
                    setError(" ");
                    setBtnActivo(true);
                    guardarTodo(e);
                } else {
                    updateTodo(e, id);
                }
            } else {
                if (id === null || id === "") {
                    setError("Correo invalido");
                } else {
                    setError2("Correo invalido");
                }

            }
        }

    }






    //con este metodo inserti registros     
    //
    //
    const guardarTodo = async (e) => {

        e.preventDefault();
        

        try {

            const body = { name, telephone, email, born, status }

            await fetch("http://localhost:8080/contact", {
                method: "POST",
                headers: { "content-type": 'application/json' },
                body: JSON.stringify(body),

            }).then((res) => {
                setError("Registro Guardado con exito")
                setTimeout(() => {
                    setError("");
                }, 2000)
                getTodos();
                limpiarCampos();
                setBtnActivo(false);
            }).catch(err => console.log(err))

        } catch (err) {
            console.error(err.message);
        }

    }

    const updateTodo = async (e, id) => {
        e.preventDefault();


        try {
            const body = { name, telephone, email, born, status }
            await fetch(`http://localhost:8080/contact/${id}`, {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(body)

            }).then((res) => {
                setError2("Registro Editado con exito")
                setTimeout(() => {
                    setError2("");
                }, 2000)
                getTodos();
            }).catch((err) => console.log(err))


        } catch (err) {
            console.error(err.message);
        }
    }

    const DeleteTodo = async (e, id) => {
        e.preventDefault();
        
        

        try {

            await fetch(`http://localhost:8080/contact/status/${id}`, {
                method: "PATCH",
                
            }).then(() => {
                getTodos();
            })


        } catch (err) {
            console.error(err.message);
        }
    }




    const getTodos = async () => {

        try {
            const response = await fetch("http://localhost:8080/");
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
        getTodos()
    }, [contador])

    const loadDates = (todo) => {
        setName(todo.name);
        setTelephone(todo.telephone);
        setEmail(todo.email);
        setBorn(todo.born);
        setStatus(todo.status)
        
    }

    






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
                        <h5 className="modal-title" id="exampleModalLabel">Guardar Nuevo Contacto</h5>
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
                        <button type="button" id="btnSave" className="btn btn-success" onClick={e => validarCampos(e, null)} disabled={btnActivo}><FontAwesomeIcon icon={faSave} />Guardar</button>
                        <button type="button" className="btn btn-secondary" onClick={() => { limpiarCampos() }} data-bs-dismiss="modal"><FontAwesomeIcon icon={faCancel} />Limpiar Campos</button>
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
                                        <button onClick={() => loadDates(todo)} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#id2${todo.id}`}>
                                            <FontAwesomeIcon icon={faEdit} />
                                            Editar
                                        </button>
                                        <div className="modal fade" id={`id2${todo.id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Editar Contacto</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body ">
                                                        <div className="container">
                                                            <div className="row">
                                                                <div className="col-4"><label>Nombre</label>
                                                                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                                                                    <label>Telefóno</label>
                                                                    <input type="text" value={telephone} onChange={e => setTelephone(e.target.value)} /></div>
                                                                <div className="col-2"></div>
                                                                <div className="col-4"><label>Correo</label>
                                                                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                                                                    <label>Nacimiento</label>
                                                                    <input type="date" value={born} onChange={e => setBorn(e.target.value)} /></div>
                                                                <div className="col-8">{error2}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-primary" data-bs-dismiss="" onClick={e => validarCampos(e, todo.id)}><FontAwesomeIcon icon={faEdit} />Editar</button>
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><FontAwesomeIcon icon={faCancel} />Cancelar</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <button  type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target={`#id3${todo.id}`}>
                                            <FontAwesomeIcon icon={faDeleteLeft} />
                                            Eliminar
                                        </button>
                                        <div className="modal fade" id={`id3${todo.id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="exampleModalLabel">Eliminar Contacto</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body ">
                                                        <div className="container">
                                                            <div className="row">
                                                                <div className="col-4"><label>Nombre</label>
                                                                    <input type="text" value={todo.name} />
                                                                    <label>Telefóno</label>
                                                                    <input type="text" value={todo.telephone} /></div>
                                                                <div className="col-2"></div>
                                                                <div className="col-4"><label>Correo</label>
                                                                    <input type="text" value={todo.email} />
                                                                    <label>Nacimiento</label>
                                                                    <input type="date" value={todo.born} /></div>
                                                                <div className="col-8">{error2}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={e => DeleteTodo(e, todo.id)}><FontAwesomeIcon icon={faDeleteLeft} />Eliminar</button>
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><FontAwesomeIcon icon={faCancel} />Cancelar</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
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
