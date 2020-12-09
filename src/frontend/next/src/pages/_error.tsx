import { NextPage } from 'next';

interface Props {
  statusCode?: number;
  errorMessage?: string;
}

const Error: NextPage<Props> = ({ statusCode, errorMessage }) => {
  return (
    <div>
      <p>{statusCode}</p>
      <p>{errorMessage}</p>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const errCode = err ? err.statusCode : 404;
  const statusCode = res ? res.statusCode : errCode;
  let errorMessage;

  switch (statusCode) {
    case 400:
      errorMessage = 'We did not understand the request!';
      break;
    case 401:
      errorMessage = 'You are not authorized to view this page!';
      break;
    case 403:
      errorMessage = 'Access is not allowed for the requested page!';
      break;
    case 404:
      errorMessage = 'We could not find what you were looking for!';
      break;
    case 405:
      errorMessage = 'Method is not allowed!';
      break;
    default:
      errorMessage = 'Somthing went wrong!';
  }

  return { statusCode, errorMessage };
};

export default Error;
