import React from 'react'

const Cancelbtn = ({ onClick, disabled }) => {
    const noRefCheck =()=>{}
    return (
        <div onClick={disabled?noRefCheck:onClick}>
            {disabled === false ?
                <svg className="x-square-fill" viewBox="4.499 4.499 12 12">
                    <path id="x-square-fill" d="M 5.964186668395996 4.750691413879395 L 10.49936866760254 9.287588119506836 L 15.03454780578613 4.750691413879395 C 15.36964797973633 4.415594100952148 15.9129467010498 4.415594100952148 16.24804306030273 4.750691413879395 C 16.58314323425293 5.085788249969482 16.58314323425293 5.62908935546875 16.24804306030273 5.964186668395996 L 11.71114921569824 10.49936866760254 L 16.24804306030273 15.03454780578613 C 16.58314323425293 15.36964797973633 16.58314323425293 15.9129467010498 16.24804306030273 16.24804306030273 C 15.9129467010498 16.58314323425293 15.36964797973633 16.58314323425293 15.03454780578613 16.24804306030273 L 10.49936866760254 11.71114921569824 L 5.964186668395996 16.24804306030273 C 5.629088401794434 16.58314323425293 5.085788249969482 16.58314323425293 4.750690460205078 16.24804306030273 C 4.415594100952148 15.9129467010498 4.415594100952148 15.36964416503906 4.750692367553711 15.03454780578613 L 9.287588119506836 10.49936866760254 L 4.750691413879395 5.964186668395996 C 4.415594100952148 5.62908935546875 4.415594100952148 5.085789203643799 4.750691413879395 4.750691413879395 C 5.085789203643799 4.415594100952148 5.62908935546875 4.415594100952148 5.964186668395996 4.750691413879395 Z">
                    </path>
                </svg> :
                <svg className="x-square-fill_g" viewBox="4.499 4.499 12 12">
                    <path id="x-square-fill_g" d="M 5.964186668395996 4.750691413879395 L 10.49936866760254 9.287588119506836 L 15.03454780578613 4.750691413879395 C 15.36964797973633 4.415594100952148 15.9129467010498 4.415594100952148 16.24804306030273 4.750691413879395 C 16.58314323425293 5.085788249969482 16.58314323425293 5.62908935546875 16.24804306030273 5.964186668395996 L 11.71114921569824 10.49936866760254 L 16.24804306030273 15.03454780578613 C 16.58314323425293 15.36964797973633 16.58314323425293 15.9129467010498 16.24804306030273 16.24804306030273 C 15.9129467010498 16.58314323425293 15.36964797973633 16.58314323425293 15.03454780578613 16.24804306030273 L 10.49936866760254 11.71114921569824 L 5.964186668395996 16.24804306030273 C 5.629088401794434 16.58314323425293 5.085788249969482 16.58314323425293 4.750690460205078 16.24804306030273 C 4.415594100952148 15.9129467010498 4.415594100952148 15.36964416503906 4.750692367553711 15.03454780578613 L 9.287588119506836 10.49936866760254 L 4.750691413879395 5.964186668395996 C 4.415594100952148 5.62908935546875 4.415594100952148 5.085789203643799 4.750691413879395 4.750691413879395 C 5.085789203643799 4.415594100952148 5.62908935546875 4.415594100952148 5.964186668395996 4.750691413879395 Z">
                    </path>
                </svg>
            }
        </div>
    )
}

export default Cancelbtn
