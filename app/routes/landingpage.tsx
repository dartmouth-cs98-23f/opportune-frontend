import React, { ReactNode, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedSectionProps {
    children: ReactNode;
  }
  
  function AnimatedSection({ children }: AnimatedSectionProps) {
    const [ref, inView] = useInView({
      triggerOnce: true, // Trigger animation only once
      threshold: 0.5, // Adjust the threshold as per your requirement
    });
    
    return (
        <div ref={ref} className={inView ? 'animated-section in-view' : 'animated-section'}>
            {React.Children.map(children, (child, index) => (
                <div style={{ transitionDelay: `${index * 1}s` }}>{child}</div>
            ))}
        </div>
    );
  }




function LandingPage() {
    const animatedRef = useRef(null);


    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content="" />
                <meta name="author" content="" />
                <title>Welcome to Opportune!</title>
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" type="text/css" />
                <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css" />
                <link rel="stylesheet" href="/landing.css" />


            </head>
            <body>
                {/* <!-- Navigation--> */}
                <nav className="navbar navbar-light bg-light static-top" >
                    <div className="container">
                        <img src="opportune_newlogo.svg"></img>
                        <a className="navbar-brand" href="#!">OPPORTUNE</a>
                        <div className="d-flex justify-content-start">
                            <a className="btn btn-primary me-2" href="#signup">Sign Up</a>
                            <a className="btn btn-primary" href="#login">Login</a>
                        </div>

                    </div>
                </nav>
                <section className="my-new-section">
                    <div className="position-relative container1">
                        <h2 className="productivity"> We're Here To Increase Your Productivity!</h2>
                        <p className="subhead1">Let us help you streamline your workflows, create diverse teams, and save time!</p>
                        <img src="/icon1.png"/>
                        <img src="/squarelogopixel.png"/>

                    </div>
                </section>
                {/* <!-- Masthead--> */}
                <header className="masthead">
                    <div className="container position-relative">
                        <div className="row justify-content-center">
                            <div className="col-xl-6">
                                <div className="text-center text-white">
                                    {/* <!-- Page heading--> */}
                                        <h1 className="mb-5">Join the Opportune Community Today!</h1>
                                        {/* <!-- Signup form-->
                                        <!-- * * * * * * * * * * * * * * *-->
                                        <!-- * * SB Forms Contact Form * *-->
                                        <!-- * * * * * * * * * * * * * * *-->
                                        <!-- This form is pre-integrated with SB Forms.-->
                                        <!-- To make this form functional, sign up at-->
                                        <!-- https://startbootstrap.com/solution/contact-forms-->
                                        <!-- to get an API token!--> */}
                                        <form className="form-subscribe" id="contactForm" data-sb-form-api-token="API_TOKEN">
                                            {/* <!-- Email address input--> */}
                                            <div className="row">
                                                <div className="col">
                                                    <input className="form-control form-control-lg" id="emailAddress" type="email" placeholder="Email Address" data-sb-validations="required,email" />
                                                    <div className="invalid-feedback text-white" data-sb-feedback="emailAddress:required">Email Address is required.</div>
                                                    <div className="invalid-feedback text-white" data-sb-feedback="emailAddress:email">Email Address Email is not valid.</div>
                                                </div>
                                                <div className="col-auto"><button className="btn btn-primary btn-lg disabled" id="submitButton" type="submit">Submit</button></div>
                                            </div>
                                            {/* <!-- Submit success message-->
                                            <!---->
                                            <!-- This is what your users will see when the form-->
                                            <!-- has successfully submitted--> */}
                                            <div className="d-none" id="submitSuccessMessage">
                                                <div className="text-center mb-3">
                                                    <div className="fw-bolder">Form submission successful!</div>
                                                    <p>To activate this form, sign up at</p>
                                                    <a className="text-white" href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
                                                </div>
                                            </div>
                                            {/* <!-- Submit error message-->
                                            <!---->
                                            <!-- This is what your users will see when there is-->
                                            <!-- an error submitting the form--> */}
                                            <div className="d-none" id="submitErrorMessage"><div className="text-center text-danger mb-3">Error sending message!</div></div>
                                        </form>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </header>
                {/* <!-- Icons Grid--> */}
                <section className="features-icons bg-light text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                        <div className="features-icons-icon d-flex"><i className="bi-window m-auto text-primary"></i></div>
                                        <h3>Team Matching</h3>
                                        <p className="lead mb-0">This theme will look great on any device, no matter the size!</p>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-3">
                                    <div className="features-icons-icon d-flex"><i className="bi-layers m-auto text-primary"></i></div>
                                    <h3>Diversity Scoring</h3>
                                    <p className="lead mb-0">Featuring the latest build of the new Bootstrap 5 framework!</p>
                                </div>
                            </div>
                                <div className="col-lg-4">
                                    <div className="features-icons-item mx-auto mb-0 mb-lg-3">
                                        <div className="features-icons-icon d-flex"><i className="bi-terminal m-auto text-primary"></i></div>
                                        <h3>Project Management</h3>
                                        <p className="lead mb-0">Ready to use with your own content, or customize the source files!</p>
                                    </div>
                                </div>
                        </div>
                    </div>
                </section>
                {/* <!-- Image Showcases--> */}
                <AnimatedSection>
                    <section className="showcase">
                        <div className="container-fluid p-0">
                            <div className="row g-0">
                                <div className="col-lg-6 order-lg-2 text-white showcase-img" style={{backgroundImage: "url('/landingbg.png')"}}></div>
                                <div className="col-lg-6 order-lg-1 my-auto showcase-text">
                                    <h2 className="imgShowcaseTitle">Team Matching</h2>
                                    <p className="lead mb-0"> Our product makes better qualitative and quatitative team matching choices giving you more time to build a better world! With us onboarding new hires has never been easier!</p>
                                </div>
                            </div>
                            <div className="row g-0">
                                <div className="col-lg-6 text-white showcase-img" style={{backgroundImage: "url('/bg-showcase-2.jpg')"}}></div>
                                <div className="col-lg-6 my-auto showcase-text">
                                    <h2 className="imgShowcaseTitle">Diversity Scoring</h2>
                                    <p className="lead mb-0">New and Innovative Algoritmic calculations allow us you to generate industry standard diverse teams that are scientifically proven to better productivity and company culture! With the click of a button you can make your teams more diverse! </p>
                                </div>
                            </div>
                            <div className="row g-0">
                                <div className="col-lg-6 order-lg-2 text-white showcase-img" style={{backgroundImage: "url('/bg-showcase-3.jpg')"}}></div>
                                <div className="col-lg-6 order-lg-1 my-auto showcase-text">
                                    <h2 className="imgShowcaseTitle">Project Management</h2>
                                    <p className="lead mb-0">Additionally we allow for HR, Teamn and New Hire collaboration on company wide projects! With multi-modal access and easy to maneuver interface the productivity is endless.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </AnimatedSection>
                {/* <!-- Testimonials--> */}
                <AnimatedSection>
                    <section className="testimonials text-center bg-light">
                        <div className="container">
                            <h2 className="mb-5">What people are saying...</h2>
                            <AnimatedSection>
                            <div className="row justify-content-center">
                                <AnimatedSection>
                                    <div className="col-lg-4 ">
                                        <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                                            <img className="img-fluid rounded-circle mb-3" src="/testimonials-1.jpg" alt="..." />
                                            <h5>Margaret E.</h5>
                                            <p className="font-weight-light mb-0">"This is fantastic! Thanks so much guys!"</p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                                <AnimatedSection>
                                    <div className="col-lg-4">
                                        <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                                            <img className="img-fluid rounded-circle mb-3" src="/testimonials-2.jpg" alt="..." />
                                            <h5>Fred S.</h5>
                                            <p className="font-weight-light mb-0">"Bootstrap is amazing. I've been using it to create lots of super nice landing pages."</p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                                <AnimatedSection>
                                    <div className="col-lg-4">
                                        <div className="testimonial-item mx-auto mb-5 mb-lg-0">
                                            <img className="img-fluid rounded-circle mb-3" src="/testimonials-3.jpg" alt="..." />
                                            <h5>Sarah W.</h5>
                                            <p className="font-weight-light mb-0">"Thanks so much for making these free resources available to us!"</p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </div>
                            </AnimatedSection>
                        </div>
                    </section>
                </AnimatedSection>
                {/* <!-- Call to Action--> */}
                <section className="call-to-action text-white text-center" id="signup">
                    <div className="container position-relative">
                        <div className="row justify-content-center">
                            <div className="col-xl-6">
                                <h2 className="mb-4">Ready to get started? Sign up now!</h2>
                                {/* <!-- Signup form-->
                                <!-- * * * * * * * * * * * * * * *-->
                                <!-- * * SB Forms Contact Form * *-->
                                <!-- * * * * * * * * * * * * * * *-->
                                <!-- This form is pre-integrated with SB Forms.-->
                                <!-- To make this form functional, sign up at-->
                                <!-- https://startbootstrap.com/solution/contact-forms-->
                                <!-- to get an API token!--> */}
                                <form className="form-subscribe" id="contactFormFooter" data-sb-form-api-token="API_TOKEN">
                                    {/* <!-- Email address input--> */}
                                    <div className="row">
                                        <div className="col">
                                            <input className="form-control form-control-lg" id="emailAddressBelow" type="email" placeholder="Email Address" data-sb-validations="required,email" />
                                            <div className="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:required">Email Address is required.</div>
                                            <div className="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:email">Email Address Email is not valid.</div>
                                        </div>
                                        <div className="col-auto"><button className="btn btn-primary btn-lg disabled" id="submitButton" type="submit">Submit</button></div>
                                    </div>
                                    {/* <!-- Submit success message-->
                                    <!---->
                                    <!-- This is what your users will see when the form-->
                                    <!-- has successfully submitted--> */}
                                    <div className="d-none" id="submitSuccessMessage">
                                        <div className="text-center mb-3">
                                            <div className="fw-bolder">Form submission successful!</div>
                                            <p>To activate this form, sign up at</p>
                                            <a className="text-white" href="https://startbootstrap.com/solution/contact-forms">https://startbootstrap.com/solution/contact-forms</a>
                                        </div>
                                    </div>
                                    {/* <!-- Submit error message-->
                                    <!---->
                                    <!-- This is what your users will see when there is-->
                                    <!-- an error submitting the form--> */}
                                    <div className="d-none" id="submitErrorMessage"><div className="text-center text-danger mb-3">Error sending message!</div></div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
                <script src="https://cdn.startbootstrap.com/sb-forms-latest.js"></script>
            </body>
        </html>
    );
}

export default LandingPage;
