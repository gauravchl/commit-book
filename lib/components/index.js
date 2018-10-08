import React from "react";

export default function() {
  return (
    <div>
      <p>The CommitBook package is Alive! Its ALIVE!</p>
      <ul>
        <li>
          <b>Soft Wrap:</b> ${item.softWrapped}
        </li>
        <li>
          <b>Tab Length:</b> ${item.getTabLength()}
        </li>
        <li>
          <b>Encoding:</b> ${item.getEncoding()}
        </li>
        <li>
          <b>Line Count:</b> ${item.getLineCount()}
        </li>
      </ul>
    </div>
  );
}
