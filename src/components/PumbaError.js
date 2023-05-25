import React, {
    Component
} from 'react'

class PumbaError extends Component {

    render(){
        return (
            <div style={{textAlign: "center",  marginTop: "10px"}}>
                <span style={{fontSize: "x-large", background: "yellow", color: "red", padding: "10px"}}>Invalid request..</span>
            </div>
        )
    }
}

export default PumbaError

