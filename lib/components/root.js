import React from "react";


class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {loading, commits={}} = this.props;

    return (
      <div>
        <p>Commit Book</p>
        <p>Loading: {loading}</p>

        <div>
          {Object.values(commits).map((commit, i) => {
            return <div key={i}>{commit.hash}</div>
          })}
        </div>
      </div>
    )
  }
}


export default Root
