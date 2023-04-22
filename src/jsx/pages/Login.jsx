import React, { useState, useContext } from 'react'
import { connect } from 'react-redux';
import { Axios, UserContext } from '../../context/UserContext';
import { pushNotify } from '../../services/NotifyService';
// image
import logo from "../../images/logo-full.png";
import loginbg from "../../images/pic1.png";
import Select from "react-select";
import { ScaleLoader } from 'react-spinners';

function Login() {
	const [isLoading, setIsLoading] = useState(false);
	const { loginUser, loggedInCheck } = useContext(UserContext);
	const [formData, setFormData] = useState({
		username: '',
		password: ''
	});
	const [formData2, setFormData2] = useState({ movie: null });
	const [multipleMovies, setMultipleMovies] = useState(false);
	const [movieOptions, setmovieOptions] = useState(null);
	const onChangeInput = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
		setMultipleMovies(false);
	}

	const submitForm = async (e) => {
		setIsLoading(true);
		e.preventDefault();
		console.log(formData);
		if (!Object.values(formData).every(val => val.trim() !== '')) {
			pushNotify('error', 'Error', 'Please Fill in all Required Fields! in');
			setIsLoading(false);
			return;
		}
		else {
			const data = await loginUser(formData);
			console.log(data);
			if (data.Success) {
				e.target.reset();
				await loggedInCheck();
			}
			else if (data.message == "multiple") {
				setmovieOptions(data.accounts);
				setMultipleMovies(true);
			}
			else pushNotify('error', 'Error', data.message);
		}
		setIsLoading(false)
	}


	return (
		<div className="authincation d-flex flex-column flex-lg-row flex-column-fluid">
			<div className="login-aside text-center  d-flex flex-column flex-row-auto">
				<div className="d-flex flex-column-auto flex-column pt-lg-40 pt-15">
					<div className="text-center mb-4 pt-5">
						<img src={logo} alt="" width={150} />
					</div>
					<h3 className="mb-2">APTS</h3>
				</div>
				<div className="aside-image" style={{ backgroundImage: "url(" + loginbg + ")" }}></div>
			</div>
			<div className="container flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
				<div className="d-flex justify-content-center h-100 align-items-center">
					<div className="authincation-content style-2">
						<div className="row no-gutters">
							{
								isLoading ? <ScaleLoader cssOverride={{ "display": "flex", "justifyContent": "center", "alignItems": "center" }} /> :
									(
										<div className="col-xl-12 tab-content">
											<div id="sign-in" className="auth-form   form-validation">
												<form onSubmit={submitForm} className="form-validate">
													<h3 className="text-center mb-4 text-black">Sign in your account</h3>
													<div className="form-group mb-3">
														<label className="mb-1" htmlFor="val-email"><strong>Username</strong></label>
														<div>
															<input type="text" className="form-control"
																value={formData.username}
																onChange={onChangeInput}
																placeholder="Type Your Username"
																name="username" id="username"
															/>
														</div>
													</div>
													<div className="form-group mb-3">
														<label className="mb-1"><strong>Password</strong></label>
														<input
															type="password" name="password" id="password"
															className="form-control"
															value={formData.password}
															placeholder="Type Your Password"
															onChange={onChangeInput}
														/>
													</div>
													{multipleMovies ? (
														<>
															<label className="mb-1"><strong>Select a movie</strong></label>
															<Select
																value={formData2.movie}
																onChange={(e) => { setFormData2({ ...formData2, "movie": e }) }}
																options={movieOptions}
															/>
														</>
													) : null}
													<div className="text-center form-group mb-3 my-3">
														<button type="submit" className="btn btn-primary btn-block">
															Sign In
														</button>
													</div>
												</form>
											</div>
										</div>
									)
							}

						</div>
					</div>
				</div>
			</div>
		</div>

	);
};

const mapStateToProps = (state) => {
	return {
		errorMessage: state.auth.errorMessage,
		successMessage: state.auth.successMessage,
		showLoading: state.auth.showLoading,
	};
};
export default connect(mapStateToProps)(Login);
