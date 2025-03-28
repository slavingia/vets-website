import environment from 'platform/utilities/environment';
import crossDomainRedirects from './crossDomainRedirects.json';
import { BATCHES } from './constants';

const deriveIsHostMatch = (redirect, currentWindow) => {
  const formattedRedirectHost = redirect?.domain
    ?.replace('www.', '')
    ?.toLowerCase();

  const formattedCurrentWindowHost = currentWindow?.location?.host
    ?.replace('www.', '')
    ?.toLowerCase();

  return formattedRedirectHost === formattedCurrentWindowHost;
};

/*
 * Redirect to a www.va.gov page if we're on a page that's being
 * replaced
 */
const redirectIfNecessary = currentWindow => {
  const currentPath = currentWindow?.location?.pathname?.toLowerCase();
  const batchRedirects = crossDomainRedirects?.filter(
    redirect => redirect?.batch,
  );

  if (batchRedirects?.length) {
    batchRedirects.forEach(batchRedirect => {
      const pathToMatch = new RegExp(batchRedirect.src, 'i');

      if (pathToMatch.test(currentPath)) {
        const { batch } = batchRedirect;

        if (BATCHES?.[batch]) {
          const { regexMatch } = BATCHES?.[batch];

          if (regexMatch.test(currentPath)) {
            // eslint-disable-next-line no-param-reassign
            currentWindow.location.href = `${environment.BASE_URL}${
              batchRedirect.dest
            }`;
          }
        }
      }
    });
  }

  // Check if the route matches an absolute cross-domain redirect.
  const absoluteCrossDomainRedirects = crossDomainRedirects?.filter(
    redirect => !redirect?.catchAll && !redirect?.isToSubdomain,
  );

  const absoluteRedirectMatch = absoluteCrossDomainRedirects?.find(redirect => {
    const isHostMatch = deriveIsHostMatch(redirect, currentWindow);

    return isHostMatch && redirect.src.toLowerCase() === currentPath;
  });

  // Redirect if it's an exact match first.
  if (absoluteRedirectMatch) {
    // eslint-disable-next-line no-param-reassign
    currentWindow.location.href = `${environment.BASE_URL}${
      absoluteRedirectMatch.dest
    }`;

    return;
  }

  // Check if the route matches a catch-all cross-domain redirect.
  const catchAllCrossDomainRedirects = crossDomainRedirects?.filter(
    redirect => redirect?.catchAll,
  );

  const catchAllRedirectMatch = catchAllCrossDomainRedirects?.find(redirect => {
    const isHostMatch = deriveIsHostMatch(redirect, currentWindow);
    const currentPathStartsWithCatchAll = currentPath.startsWith(
      redirect.src.toLowerCase(),
    );

    return isHostMatch && currentPathStartsWithCatchAll;
  });

  // Redirect if if there is a catch-all match.
  if (catchAllRedirectMatch) {
    // eslint-disable-next-line no-param-reassign
    currentWindow.location.href = `${environment.BASE_URL}${
      catchAllRedirectMatch.dest
    }`;
  }

  // Check if redirect destination is to a subdomain
  const toSubdomainRedirects = crossDomainRedirects?.filter(
    redirect => redirect?.isToSubdomain,
  );

  const toSubdomainRedirectMatch = toSubdomainRedirects?.find(redirect => {
    const isHostMatch = deriveIsHostMatch(redirect, currentWindow);
    const currentPathMatchesSubdomainSrc =
      currentPath === redirect.src.toLowerCase();

    return isHostMatch && currentPathMatchesSubdomainSrc;
  });

  // Redirect if there is a to subdomain match
  if (toSubdomainRedirectMatch) {
    // eslint-disable-next-line no-param-reassign
    currentWindow.location.href = `${toSubdomainRedirectMatch.dest}`;
  }
};

export default redirectIfNecessary;
