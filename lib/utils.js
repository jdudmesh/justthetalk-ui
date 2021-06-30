// This file is part of the JUSTtheTalkUI distribution (https://github.com/jdudmesh/justthetalk-ui).
// Copyright (c) 2021 John Dudmesh.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, version 3.

// This program is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

export function compareFolders(a, b) {
    if(a.description < b.description) {
      return -1;
    } else if(a.description > b.description) {
      return 1;
    } else {
        return 0;
    }
}

export function compareIgnoredUsers(a, b) {
  let name1 = a.ignoredUserName.toLowerCase();
  let name2 = b.ignoredUserName.toLowerCase();
  if(name1 < name2) {
    return -1;
  } else if(name1 > name2) {
    return 1;
  } else {
      return 0;
  }
}

export function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}