import React, { useState } from 'react';
import Axios from 'axios'
import classes from './Card.module.css';
//import CardOption from './OptionCard';
//import FormCard from './NewTopicFormCard';
import { useLocation, useNavigate, Link } from 'react-router-dom'
import './Lesson_style.css'
import Composer from './Composer';
import CodeEditor from './Code_editor'; 
import Navbar from './Navbar';
import {BiTrash} from 'react-icons/bi';
import placeholder from './imageplaceholder.png';
//<label>{'\u002a'}</label> for *

const CreateLessonContentPage = () => {
	
	const navigate = useNavigate();
	const location = useLocation();
	const data = location.state;
	console.log(data);
	const topic = data['topic'];
	const lessonid = data['lesson'];
	const [inputFields, setInputFields] = useState([
		{text1: ''}
		])
	const [inputType, setInputType] = useState('');
	
	const handleFormChange = (index, event) => {
		let data = [...inputFields];
		console.log(event.target.files);
		if(event.target.name == "image1"){
			data[index][event.target.name] = event.target.files; //use .files for images
		}else{
			data[index][event.target.name] = event.target.value;
		}
		
		setInputFields(data);
	}
	
	const addFields = (type) => {
		if (type == 'text'){
			let newfield = {text1: ''};
			let input = "text";
			setInputType(input)
			setInputFields([...inputFields, newfield])
		}
		else if (type == 'image') {
			let newfield = {image1: ''};
			let input = "image";
			setInputType(input)
			setInputFields([...inputFields, newfield])
		}
		else if(type === 'composer'){
            let newfield = {circuit1: ''};
			let input = "circuit";
			setInputType(input)
			setInputFields([...inputFields, newfield])

        }
		else if(type === 'code'){
            let newfield = {code1: ''};
			let input = "code";
			setInputType(input)
			setInputFields([...inputFields, newfield])

        }
	}
	
	const submit = (e) => {
		const data = new FormData(); //create form data
		//console.log("this is the input: ",inputFields);
		let i=0;
		data.append("lessonid", lessonid);
		//console.log(lessonid);
		if (inputFields.length === 0) {
			alert("Lesson content is empty");
		}
		else {
			for(i=0; i<inputFields.length;i++){
				if(inputFields[i].text1 !== undefined){
					data.append("text"+i, inputFields[i].text1);
					//console.log(inputFields[i].text1)
				}
				else if(inputFields[i].image1 !== undefined){
					data.append("image"+i, inputFields[i].image1[0]);
					//console.log(inputFields[i].image1[0]);
				}
				else if(inputFields[i].circuit1 !== undefined){
					let circuit_string = JSON.stringify(inputFields[i].circuit1);
					data.append("circuit"+i, JSON.stringify({"circuit":circuit_string}));
					console.log(circuit_string)
				}
				else if(inputFields[i].code1 !== undefined){
					let code_string = JSON.stringify(inputFields[i].code1);
					data.append("code"+i, JSON.stringify({"code":inputFields[i].code1}) );
					console.log(code_string)
	
				}
			}
			console.log()
			Axios.post('https://ezq-php.herokuapp.com/createlessoncontent.php', data,{
				//sent data as form 
			}).then((response) => {
				console.log(response.data)
				navigate('/educatorlessoninfo', { state: { lesson: lessonid } });
				if (response.data.message) {
					console.log(response.data)
				}
				else {
					console.log(response.data)
				}
			}); 
		}
	}
	
	const removeFields = (index) => {
		let data = [...inputFields];
		data.splice(index, 1)
		setInputFields(data)
	}
	const getCircuitValue = (index, circuit) => {
        let data = [...inputFields];
        data[index]['circuit1'] = circuit;

    }

	const getCodeValue = (index,code)=>{
		let data = [...inputFields];
		data[index]['code1'] = code;
	}

	const getImageSrc = (index) =>{
		let url = placeholder;
		let fields = inputFields;
			if(fields[index] !== undefined){
				if(fields[index].image1  !== undefined){
					if(fields[index].image1[0]  !== undefined){
						url = URL.createObjectURL(fields[index].image1[0]);
					}
				}				
			}
		return(url);
	}

	return (
		<div>
			<Navbar/>
			<div style={{marginBottom:"2%", marginTop:"2%"}}>
			<Link to="/educatorlessoninfo" state={{ lesson: lessonid }}style={{fontFamily: "Helvetica", color: "#405499", fontSize: "12pt", textDecoration: "none", marginLeft:"5%"}}>{'\u003c'}{'\u003c'} Back to Lesson information page</Link>
            <div style={{marginLeft:"10%"}}><h4>{topic}</h4></div>
			<div className="pagebody" id="createlessoncontent-formbox">
                <div>
					
					<div>
						<label>Lesson Content </label>
						<p>Add content to your lesson.</p>
						{inputFields.map((input, index) => {
							console.log(input)
							if (input.text1 !== undefined) {
								return (
									<div key={index}>
										<div>
											<textarea id='topiccontent' className="textareabox" style={{width: "100%"}} name='text1' placeholder='...Add text...' value={input.text1} 
												onChange={event => handleFormChange(index, event)}/>
											<div style={{display:"flex", justifyContent:"end",justifyItems:"end",alignContent:"end"}}>                            
                                				<button className="menu-btn red" onClick={() => removeFields(index)}><BiTrash/></button>
                            				</div>
											<br className="clearinline"/>
										</div>
									</div>
								)
							}
							else if (input.image1 !== undefined) {
								return (
									<div key={index}>
										<div>
											<label for="fileUpload"/>
											{/*<div key={index} style={{border:"solid grey 1px", textAlign:"center", paddingTop:"1%"}}>
                             <img src={this.getImageSrc(index,option)} style={{maxWidth:"100%"}}/>
                             <div style={{textAlign:"center"}}>
                            <input type='file' name='image'  
                                onChange={(ev)=>{this.addValue(ev,index,option)}}/>
                            <button className="menu-btn red" onClick={() => this.removeField(index,option)}><BiTrash/></button>
                            </div>
                        </div> */}			<div key={index} style={{border:"solid grey 1px", textAlign:"center", paddingTop:"1%"}}>
											<img src={getImageSrc(index)} style={{maxWidth:"100%"}}/>
											<div style={{textAlign:"center"}}>
											<input type='file' name='image1' id="fileUpload"
												onChange={event => handleFormChange(index, event)}/>
											<div style={{display:"flex", justifyContent:"end",justifyItems:"end",alignContent:"end"}}>                            
                                				<button className="menu-btn red" onClick={() => removeFields(index)}><BiTrash/></button>
                            				</div>
											</div>
											</div>
										
											<br className="clearinline"/>
										</div>
									</div>
								)
							}
							else if(input.circuit1 !== undefined){
								return(
									<div key={index}>
										<div><Composer option={"exampleAdder"} getCircuitValue ={getCircuitValue} index={index}/></div>
										<div style={{display:"flex", justifyContent:"end",justifyItems:"end",alignContent:"end"}}>                            
                                				<button className="menu-btn red" onClick={() => removeFields(index)}><BiTrash/></button>
                            			</div>
									</div>
								)
							}
							else if(input.code1 !== undefined){
								return(
									<div key={index}>
										<div><CodeEditor option={"exampleAdder"} getCodeValue={getCodeValue} index={index}/></div>
										<div style={{display:"flex", justifyContent:"end",justifyItems:"end",alignContent:"end"}}>                            
                                				<button className="menu-btn red" onClick={() => removeFields(index)}><BiTrash/></button>
                            			</div>
									</div>
								)
							}
						
						})}
					</div>
				</div>
				<div id="createlessoncontent-addtool">
					<p style={{fontSize: 16, color: "#405499"}}>Add additional texts, images, circuits and code here</p>
					<button className="menu-btn" style={{margin: 15}} onClick={() => addFields('text')}>Add text</button>
					<button className="menu-btn" style={{margin: 15}} onClick={() => addFields('image')}>Add image</button>
					<button className="menu-btn" style={{margin: 15}} onClick={() => addFields('composer')}>Add circuit</button>
					<button className="menu-btn" style={{margin: 15}} onClick={() => addFields('code')}>Add code</button><br /><br />	
				</div>
				<div id="createlessoncontent-create">
					<button className="button button-blue" onClick={submit}>Create</button> 
				</div>
			</div>
			<Link to="/educatorlessoninfo" state={{ lesson: lessonid }}style={{fontFamily: "Helvetica", color: "#405499", fontSize: "12pt", textDecoration: "none", marginLeft:"5%"}}>{'\u003c'}{'\u003c'} Back to Lesson information page</Link>
			</div>
		</div>
	);
}

export default CreateLessonContentPage;