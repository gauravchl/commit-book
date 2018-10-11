"use babel";
import { GitProcess } from "dugite";

const Repo = {
  async getCommits(option) {
    const paths = atom.project.getPaths();
    const path = paths && paths[0];
    if (!path) return;

    const { max = 10000, ref = "HEAD" } = option || {};

    const result = await GitProcess.exec(
      [
        "log",
        "--pretty=format:%H%x00%ae%x00%at%x00%s%x00%b%x00%an",
        "--no-abbrev-commit",
        "-z",
        "-n",
        max,
        ref,
        "--"
      ],
      path
    );
    const { stdout = "", stderr, exitCode } = result;
    if (exitCode !== 0 || stdout === "") {
      return [];
    }
    const fields = stdout.trim().split("\0");
    const commits = [];
    for (let i = 0; i < fields.length; i += 6) {
      const body = fields[i + 4];

      const { message: messageBody, coAuthors } = _getMessageAndCoAuthor(body);

      commits.push({
        sha: fields[i] && fields[i].trim(),
        authorEmail: fields[i + 1] && fields[i + 1].trim(),
        authorDate: parseInt(fields[i + 2], 10) * 1000,
        authorName: fields[i + 5] && fields[i + 5].trim(),
        messageSubject: fields[i + 3],
        messageBody,
        coAuthors
      });
    }
    return commits;
  },

  async getBranches() {
    const paths = atom.project.getPaths();
    const path = paths && paths[0];
    if (!path) return;

    const result = await GitProcess.exec(["branch", "-a"], path);
    const { stdout = "", stderr, exitCode } = result;
    if (exitCode !== 0 || stdout === "") {
      return [];
    }
    return stdout.split("\n").map(item => item.trim());
  },

  async getCommitDiff(sha) {
    const paths = atom.project.getPaths();
    const path = paths && paths[0];
    if (!path) return;
    const result = await GitProcess.exec(["diff", "-U1", sha], path);
    const { stdout = "", stderr, exitCode } = result;
    if (exitCode !== 0 || stdout === "") {
      return [];
    }
    return stdout;
  }
};

const _getMessageAndCoAuthor = commitMessage => {
  const LINE_ENDING_REGEX = /\r?\n/;
  const CO_AUTHOR_REGEX = /^co-authored-by. (.+?) <(.+?)>$/i;
  const messageLines = [];
  const coAuthors = [];

  for (const line of commitMessage.split(LINE_ENDING_REGEX)) {
    const match = line.match(CO_AUTHOR_REGEX);
    if (match) {
      const [_, name, email] = match;
      coAuthors.push({ name, email });
    } else {
      messageLines.push(line);
    }
  }

  return { message: messageLines.join("\n"), coAuthors };
};

export default Repo;
