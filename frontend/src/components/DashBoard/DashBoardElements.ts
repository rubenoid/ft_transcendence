import styled from 'styled-components';
import { ContextReplacementPlugin } from 'webpack';
import { string } from 'prop-types';

export const DashBoardContainer = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 200px 400px 200px;
    grid-template-areas: 
    " col1 col2 col3 col4"
    " col5 game game chat"
    " col6 game game chat"; 
    grid-gap: 10px;
    background-color: #fff;
    color: #444;
    margin: 20px ;
    
    @media screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
    }
`;

type BoxProps = {
    gridArea: string
}

export const Box = styled.div<BoxProps>`
    background-color: #444;
    color: #fff;
    padding: 20px;
    border-radius: 5px;
    grid-area: ${(props: BoxProps) => props.gridArea};
`;
