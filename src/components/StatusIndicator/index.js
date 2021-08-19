import "./index.css";
import classNames from "classnames";

function StatusIndicator(props) {
  if (!props.status || props.status === "Status") {
    return (
      <div style={{"font-weight": "normal"}}>{"Status"}</div>
    );
  }

  return (
    <div className={classNames(
      "status-indicator",
      {"status-indicator--codemaster": props.status === "codemaster"},
      {"status-indicator--active": props.status === "active"},
      {"status-indicator--inactive": props.status === "inactive"},
    )}>
    </div>
  );
}
  
export default StatusIndicator;
