import "./index.css";

function Announcer(props) {
  const message = props.message;

  return (
      <div className="announcer text-center text-uppercase fw-bold fs-5">
        {message}
      </div>
  );
}

export default Announcer;
