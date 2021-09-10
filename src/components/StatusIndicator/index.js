import "./index.css";
import classNames from "classnames";
import Status from "../../constants/status.js";

function StatusIndicator(props) {
  if (!props.status || props.status === "Status") {
    return (
      <div style={{"font-weight": "normal"}}>{"Status"}</div>
    );
  }

  return (
    <div className={classNames(
      "status-indicator",
      {"status-indicator--codemaster": props.status === Status.CODEMASTER},
      {"status-indicator--active": props.status === Status.ACTIVE},
      {"status-indicator--inactive": props.status === Status.INACTIVE},
    )}>
    </div>
  );
}
  
export default StatusIndicator;
