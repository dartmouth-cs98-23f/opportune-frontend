import React, { ReactNode, useRef } from 'react';
import { json, redirect, ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Link, Form } from '@remix-run/react';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

function HowWeWorkPage() {
  return (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>Opportune - How We Work</title>
            <meta content="" name="description"/>
            <meta content="" name="keywords"/>

            <link href="/assets/img/favicon.png" rel="icon"/>
            <link href="/assets/img/apple-touch-icon.png" rel="apple-touch-icon"/>

            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"  />
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet"/>

            {/* <!-- Vendor CSS Files --> */}
            <link href="/assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet"/>
            <link href="/assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet"/>
            <link href="/assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet"/>
            <link href="/assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet"/>
            <link href="/assets/css/main.css" rel="stylesheet" />
        </head>

        <body>
        {/* // <!-- ======= Hero Section ======= --> */}
            <section id="hero" className="hero">
                <div className="container position-relative">
                    <div className="row gy-5" data-aos="fade-in">
                        <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center text-center text-lg-start">
                            <h2>Welcome to <span>OPPORTUNE</span></h2>
                            <p>Learn More about how we work by watching our Demo video below!
                            </p>
                            <div className="d-flex justify-content-center justify-content-lg-start">
                                <a href="#about" className="btn-get-started">Get Started</a>
                                <a href="https://www.youtube.com/watch?v=LXb3EKWsInQ" className="glightbox btn-watch-video d-flex align-items-center"><i className="bi bi-play-circle"></i><span>Watch Video</span></a>
                            </div>
                        </div>
                        <div className="col-lg-6 order-1 order-lg-2">
                            <img src="/teamwork.svg" className="img-fluid" alt="" data-aos="zoom-out" data-aos-delay="100"/>
                        </div>
                    </div>
                </div>

                <div className="icon-boxes position-relative">
                    <div className="container position-relative">
                        <div className="row gy-4 mt-5">

                            <div className="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
                                <div className="icon-box">
                                <div className="icon"><i className="bi bi-easel"></i></div>
                                <h4 className="title"><a href="" className="stretched-link">Diverse Team Matching </a></h4>
                                </div>
                            </div>
                            {/* <!--End Icon Box --> */}

                            <div className="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
                                <div className="icon-box">
                                <div className="icon"><i className="bi bi-gem"></i></div>
                                <h4 className="title"><a href="" className="stretched-link">Project Management</a></h4>
                                </div>
                            </div>
                            {/* <!--End Icon Box --> */}

                            <div className="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
                                <div className="icon-box">
                                <div className="icon"><i className="bi bi-geo-alt"></i></div>
                                <h4 className="title"><a href="" className="stretched-link">Easy Onboarding</a></h4>
                                </div>
                            </div>
                            {/* <!--End Icon Box --> */}

                            <div className="col-xl-3 col-md-6" data-aos="fade-up" data-aos-delay="500">
                                <div className="icon-box">
                                <div className="icon"><i className="bi bi-command"></i></div>
                                <h4 className="title"><a href="" className="stretched-link"> Company Streamlining</a></h4>
                                </div>
                            </div>
                            {/* <!--End Icon Box --> */}

                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- End Hero Section --> */}

            {/*<!-- ======= About Us Section ======= --> */}

            <section id="about" className="about">
                < div className="container" data-aos="fade-up">

                    <div className="section-header">
                        <h2>About Us</h2>
                        <p>
                            Starting as a undergraduate Dartmouth College capstone project, our team has innovated and cultivated the perfect product to help
                            companies and new hires alike. With Opportune you can match your skillset and curate diverse teams with
                            the simple use of algorithms. 
                        </p>                   
                    </div>

                    <div className="row gy-4">
                        <div className="col-lg-6">
                            <h3>Diverse Teams Efficiency and Innovation Research</h3>
                            <img src="/assets/img/about.jpg" className="img-fluid rounded-4 mb-4" alt=""/>
                            <p>Ut fugiat ut sunt quia veniam. Voluptate perferendis perspiciatis quod nisi et. Placeat debitis quia recusandae odit et consequatur voluptatem. Dignissimos pariatur consectetur fugiat voluptas ea.</p>
                            <p>Temporibus nihil enim deserunt sed ea. Provident sit expedita aut cupiditate nihil vitae quo officia vel. Blanditiis eligendi possimus et in cum. Quidem eos ut sint rem veniam qui. Ut ut repellendus nobis tempore doloribus debitis explicabo similique sit. Accusantium sed ut omnis beatae neque deleniti repellendus.</p>
                        </div>

                        <div className="col-lg-6">
                            <div className="content ps-0 ps-lg-5">
                                <p className="fst-italic">
                                    How might we solve these issues: 
                                </p>
                                <ul>
                                    <li><i className="bi bi-check-circle-fill"></i> HMW help companies streamline mundane tasks in an efficient yet qualitative manner?</li>
                                    <li><i className="bi bi-check-circle-fill"></i> HMW help new hires join companies where they are valued and they can build the skills they are interested in?</li>
                                    <li><i className="bi bi-check-circle-fill"></i> HMW curate diverse teams to ensure employees enjoy their work environment and companies can capitalize on a range of skillsets?</li>
                                </ul>
                                <p>
                                    Take a deeper look into our UI/UX research that lead to our mission statment! 
                                </p>

                                <div className="position-relative mt-4">
                                    <img src="assets/img/about-2.jpg" className="img-fluid rounded-4" alt=""/>
                                    <a href="https://www.youtube.com/watch?v=LXb3EKWsInQ" className="glightbox play-btn"></a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            {/* <!-- End About Us Section --> */}

            {/* <!-- ======= Frequently Asked Questions Section ======= --> */}
            <section id="faq" className="faq">
                <div className="container" data-aos="fade-up">

                    <div className="row gy-4">

                        <div className="col-lg-4">
                            <div className="content px-xl-5">
                                <h3>Frequently Asked <strong>Questions</strong></h3>
                                <p>
                                    Click to see some of our FAQs answered!  
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-8">

                            <div className="accordion accordion-flush" id="faqlist" data-aos="fade-up" data-aos-delay="100">

                                <div className="accordion-item">
                                    <h3 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-1">
                                            <span className="num">1.</span>
                                            How does our matching algorithm work?
                                        </button>
                                    </h3>
                                    <div id="faq-content-1" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                        <div className="accordion-body">
                                            Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h3 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-2">
                                            <span className="num">2.</span>
                                            How do I onboard my company?
                                        </button>
                                    </h3>
                                    <div id="faq-content-2" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                        <div className="accordion-body">
                                            Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h3 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-3">
                                            <span className="num">3.</span>
                                            What is the Diversity Matching Metric and how does it work?
                                        </button>
                                    </h3>
                                    <div id="faq-content-3" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                        <div className="accordion-body">
                                            Eleifend mi in nulla posuere sollicitudin aliquam ultrices sagittis orci. Faucibus pulvinar elementum integer enim. Sem nulla pharetra diam sit amet nisl suscipit. Rutrum tellus pellentesque eu tincidunt. Lectus urna duis convallis convallis tellus. Urna molestie at elementum eu facilisis sed odio morbi quis
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h3 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-4">
                                            <span className="num">4.</span>
                                            How can I become a beta tester?
                                        </button>
                                    </h3>
                                    <div id="faq-content-4" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                        <div className="accordion-body">
                                            Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi. Id interdum velit laoreet id donec ultrices. Fringilla phasellus faucibus scelerisque eleifend donec pretium. Est pellentesque elit ullamcorper dignissim. Mauris ultrices eros in cursus turpis massa tincidunt dui.
                                        </div>
                                    </div>
                                </div>

                                <div className="accordion-item">
                                    <h3 className="accordion-header">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq-content-5">
                                            <span className="num">5.</span>
                                            What are the pricing plans?
                                        </button>
                                    </h3>
                                    <div id="faq-content-5" className="accordion-collapse collapse" data-bs-parent="#faqlist">
                                        <div className="accordion-body">
                                            <ul>
                                                <li> Demo Beta Tester Package: </li>
                                                <li> Plan A: </li>
                                                <li> Plan B: </li>
                                                <li> Plan C: </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* <!-- Call to Action--> */}
            <section className="call-to-action text-white text-center" id="signup">
                <div className="container position-relative">
                    <div className="row justify-content-center">
                        <div className="col-xl-6">
                            <h2 className="mb-4">Interested in our product? Subscribe to our newsletter!</h2>
                            {/* <!-- Signup form-->
                            <!-- * * * * * * * * * * * * * * *-->
                            <!-- * * SB Forms Contact Form * *-->
                            <!-- * * * * * * * * * * * * * * *-->
                            <!-- This form is pre-integrated with SB Forms.-->
                            <!-- To make this form functional, sign up at-->
                            <!-- https://startbootstrap.com/solution/contact-forms-->
                            <!-- to get an API token!--> */}
                            <Form className="fomr-subscribe" id="contactFormFooter" method="post" action="/landingpage">
                                <div className="row">
                                    <div className="col">
                                        <input className="form-control form-control-lg" id="emailAddressBelow" type="email" placeholder="Email Address" name="email" />
                                        {/*<div className="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:required">Email Address is required.</div>
                                        <div className="invalid-feedback text-white" data-sb-feedback="emailAddressBelow:email">Email Address Email is not valid.</div>*/}
                                    </div>
                                    <div className="col-auto"><button className="btn btn-primary btn-lg" id="submitButton" type="submit">Submit</button></div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </section>


            {/* <!-- End Frequently Asked Questions Section --> */}
            {/*   <!-- ======= Footer ======= --> */}

            <footer id="footer" className="footer">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-lg-5 col-md-12 footer-info">
                            <a href="index.html" className="logo d-flex align-items-center">
                                <span>Opportune</span>
                            </a>
                        </div>


                        <div className="col-lg-3 col-md-12 footer-contact text-center text-md-start">
                            <h4>Contact Us</h4>
                            <p>
                                15 Thayer Drive <br/>
                                Hanover, NH 03755<br/>
                                United States <br/><br/>
                                <strong>Email:</strong> opportune.contact.now@gmail.com<br/>
                            </p>
                        </div>


                    </div>
                </div>
            </footer>
            {/* <!-- End Footer --> */}

            <a href="#" className="scroll-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>

            {/* <!-- Vendor JS Files --> */}
            <script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
            <script src="/assets/vendor/aos/aos.js"></script>
            <script src="/assets/vendor/glightbox/js/glightbox.min.js"></script>
            <script src="/assets/vendor/purecounter/purecounter_vanilla.js"></script>
            <script src="/assets/vendor/swiper/swiper-bundle.min.js"></script>
            <script src="/assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
            <script src="/assets/vendor/php-email-form/validate.js"></script>

            {/* <!-- Template Main JS File --> */}
            <script src="/assets/js/main.js"></script>

        </body>
    </html>

  );
}

export default HowWeWorkPage;
