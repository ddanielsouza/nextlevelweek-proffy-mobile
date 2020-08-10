import React from 'react';

interface IsVisibleProps{
    isVisible: boolean    
}

const IsVisible: React.FC<IsVisibleProps> = ({children,isVisible}) => (<>{isVisible && children}</>)

export default IsVisible