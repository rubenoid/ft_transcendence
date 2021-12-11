import styled from 'styled-components';
import { ContextReplacementPlugin } from 'webpack';
import { string } from 'prop-types';

export const DashBoardContainer = styled.div`
    height: 100%;
    display: grid;
    grid-template-columns: 200px 1fr 1fr 1fr;
    grid-template-rows: 200px 500px 200px;
    grid-template-areas: 
    " sideBar col2 col3 col4"
    " sideBar game game chat"
    " sideBar game game chat"; 
    grid-gap: 10px;
    background-color: #fff;
    color: #444;
    
    @media screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
    }
`;

type BoxProps = {
    gridArea: string,
    alignSelf?: string,
    bgColor?: string,
    fontColor?: string
}

export const Box = styled.div<BoxProps>`
    background-color: #444;
    background-color: ${(props: BoxProps) => props.bgColor};
    padding: 10px;
    border-radius: 5px;
    grid-area: ${(props: BoxProps) => props.gridArea};
    place-self: ${(props: BoxProps) => props.alignSelf};
`;
