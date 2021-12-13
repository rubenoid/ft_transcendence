import styled from 'styled-components';
import { ContextReplacementPlugin } from 'webpack';
import { string } from 'prop-types';

export const DashBoardContainer = styled.div`
    margin-left: auto;
    margin-right: auto;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 
    " col2 col3 col4"
    " game game chat "
    " game game chat"; 
    grid-gap: 10px;
    background-color: #fff;
    color: #444;
    padding: 10px;
    
    @media screen and (max-width: 768px) {
        display: flex;
        flex-direction: column;
    }
`;

type BoxProps = {
    gridArea: string,
    alignSelf?: string,
    bgColor?: string,
}

export const Box = styled.div<BoxProps>`
    background-color: #444;
    background-color: ${(props: BoxProps) => props.bgColor};
    border-radius: 5px;
    grid-area: ${(props: BoxProps) => props.gridArea};
    place-self: ${(props: BoxProps) => props.alignSelf};
    overflow: hidden;
`;
