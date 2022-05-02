import React, { useEffect, useState } from 'react';
import './css/style.css';
import imgheader from './img/headerlogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faCancel, faEdit, faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import validator from 'validator';

/**
 * este componente cosume los servicios de api y muestra los resultados
 * permite realizar CRUD (se uso borrado logico)
 * se utilizan  hooks useState para inicializar la variable y el set para
 * cambiar dicho valor, el hook useEffect me permite realizar una accion
 * despues de ejecutar un codigo, especifico en este caso cargar los datos
 * al inicar la vista 
 * @returns retorna una vista con los datos capturados
 */
const Principal = () => {

    /**
     * esta variable almacena un vector de objetos con todos los datos
     * su estado inicial es vacio[]
     */
    const [todos, setTodos] = useState([]);

    /**
     * esta variable almacenara el nombre del contacto 
     */
    const [name, setName] = useState('');

    /**
     * esta variable almacenara el Telefóno del contacto 
     */
    const [telephone, setTelephone] = useState('');

    /**
     * esta variable almacenara el email del contacto 
     */
    const [email, setEmail] = useState('');

    /**
     * esta variable fecha nacimiento  del contacto 
     */
    const [born, setBorn] = useState('');

    /**
     * esta variable almacenara el estado del contacto 
     * por defecto esta activo
     */
    const [status, setStatus] = useState('activado');

    /**
     * esta variable almacenara el error cuando se 
     * deje un campo en blanco al guardar 
     */
    const [error, setError] = useState('');

    /**
     * esta variable almacenara el error, cuando se 
     * deje un campo en blanco al editar
     */
    const [error2, setError2] = useState('');

    /**
     * esta variable almacenara el estado de boton
     * guardar, es decir se deshbilite luego de dar click
     * sobre dicho boton, se activara luego de que el 
     * guardado sea exitoso.
     * 
     */
    let [btnActivo, setBtnActivo] = useState(false);

    /**
     * se utiliza como parametro en el hook useEffect
     * permite solo cargar los datos la pagina una vez
     * al iniciar,
     * NOTA:
     * si se deja sin este parametro este hook ejecutara la carga de datos cada segundo
     * lo que no es recomendable
     */
    let contador = 0;


    /**
     * esta funcion valida que los campos no queden en blanco
     */
    const validarCampos = (e, todo) => {

        if (name === null || name === "") {
            setError("Se requiere el Nombre del Contacto");
            setError2("Se requiere el Nombre del Contacto");

        } else if (telephone === null || telephone === "") {
            setError("Se requiere el Telefóno del Contacto");
            setError2("Se requiere el Telefóno del Contacto");

        } else if (email === null || email === "") {
            setError("Se requiere el Correo del Contacto");
            setError2("Se requiere el Correo del Contacto");

        } else if (born === null || born === "") {
            setError("Se requiere Fecha Nacimiento del Contacto");
            setError2("Se requiere Fecha Nacimiento del Contacto");

        } else {
            if (todo === null) {
                let option = validator.isEmail(email);
                if (option) {
                    setError(" ");
                    setBtnActivo(true);
                    guardarTodo(e);
                } else {
                    setError("Correo invalido");
                }
            } else {
                let option2 = validator.isEmail(email);
                if (option2) {
                    updateTodo(e, todo.id);
                } else {
                    setError2("Correo invalido");
                }
            }

        }

    }

    /**
     * permite guardar los datos de nuevo contacto
     * es una funcion asincrona 
     */
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

    /**
     * permite actualizar los datos del contacto
     * es una funcion asincrona 
     */
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

    /**
     * permite borrar un contacto (borrado logico)
     * es una funcion asincrona 
     */
    const DeleteTodo = async (e, id) => {
        e.preventDefault();
        try {

            await fetch(`http://localhost:8080/contact/status/${id}`, {
                method: "PATCH",

            }).then(() => {
                getTodos();
            }).catch((err) => console.log(err))


        } catch (err) {
            console.error(err.message);
        }
    }

    /**
     * esta funcion permite cargar todos lo datos existentes
     * y actualiza el estado de la variable todos (setTodos())
     */
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
        setError('');
        setError2('');

    }
    /**
     * este hook permite acceso solo una vez 
     * ql cargar la pagina a la funcion getTodos
     * el parametro contador permite ese control
     */
    useEffect(() => {
        getTodos()
    }, [contador])

    /**
     * actualiza las variable
     * se utiliza al editar un contacto
     */
    const loadDates = (todo) => {
        setName(todo.name);
        setTelephone(todo.telephone);
        setEmail(todo.email);
        setBorn(todo.born);
        setStatus(todo.status)

    }

    /**
     * retorna la pagina
     */
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
                            /**
                             * mapea todos los contactos existentes en variable la
                             * todos(vector), y pasa una a todo mostrar respectiva-
                             * mente
                             */
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
                                                        <button type="button" className="btn btn-primary" data-bs-dismiss="" onClick={e => validarCampos(e, todo)}><FontAwesomeIcon icon={faEdit} />Editar</button>
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"><FontAwesomeIcon icon={faCancel} />Cancelar</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target={`#id3${todo.id}`}>
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
                                                                    <input type="text" value={todo.name} readOnly />
                                                                    <label>Telefóno</label>
                                                                    <input type="text" value={todo.telephone} readOnly /></div>
                                                                <div className="col-2"></div>
                                                                <div className="col-4"><label>Correo</label>
                                                                    <input type="text" value={todo.email} readOnly />
                                                                    <label>Nacimiento</label>
                                                                    <input type="date" value={todo.born} readOnly /></div>
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
