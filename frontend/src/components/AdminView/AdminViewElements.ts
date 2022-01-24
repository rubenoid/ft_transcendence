import styled from "styled-components";

export const AdminContainer = styled.div`
	background-color: white;
	border-radius: 7px;
	padding: 20px;
`;
export const Text = styled.p`
	color: red;
	font-size: 1rem;

	@media screen and (max-width: 768px) {
		font-size: 24px;
	}

	@media screen and (max-width: 480px) {
		font-size: 18px;
	}
`;
