import { Link } from '@remix-run/react';
import loginStyle from '~/styles/home.css';
import MainNavigation from '~/components/MainNav';

export default function Teams() {
	return (
		<div id="flex-container">
			<div id="sidebar">
				<MainNavigation />
			</div>
			<div id="content">
				<h1>Welcome, Intern</h1>
				<div className="team-box">
					<div className="team-text">
						<h3>Data Science Team</h3>
						<p> The Data Science Team is committed to leveraging data-driven approaches to support informed decision-making, optimize processes, and drive innovation within the company. We transform raw data into actionable insights, predictive models, and data products that contribute to the overall success of the organization.  </p>
						<p> Tools and Technologies:
							<li> Python, R, scikit-learn, Tensorflow, Pytorch, AWS, Azure, SQL, PowerBI </li>
						</p>
					</div>
				</div>
				<div className="team-box">
					<div className="team-text">
						<h3> Finance Team </h3>
						<p> The Finance Team is dedicated to maintaining financial stability, optimizing resource allocation, and providing accurate financial guidance to support the company's growth and sustainability. We are responsible for managing the company's finances, forecasting, and analyzing financial data, and ensuring regulatory compliance. </p>
						<p> Tools and Technologies:
							<li> EXCEL MONKEY EVERYDAY </li>
						</p>
					</div>
				</div>
				<div className="team-box">
					<div className="team-text">
						<h3> Cybersecurity </h3>
						<p> The Cybersecurity Team is dedicated to protecting the company's digital assets, ensuring the confidentiality, integrity, and availability of data, and mitigating cyber threats. We implement robust security measures, conduct risk assessments, and stay vigilant in defending against evolving cyber threats. </p>
						<p> Tools and Technologies:
							<li> SIEM, IDPS, Antivirus / anti-malware software, encryption tools, vulnerability scanning, IAM platforms </li>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export function links() {
	return [{ rel: 'stylesheet', href: loginStyle }];
}