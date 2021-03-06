import React from 'react';
import {Link} from 'react-router';
import allIcons from '../lib/allIcons.js';
import allColors from '../lib/allColors.js';
import urlHelper from '../utils/urlHelper.jsx';
import checkLength from '../utils/lengthHelper.jsx';

export default ({subscriptions}) => {
  subscriptions = subscriptions.filter(function (item) {
    return !!item.title;
  });

  if (subscriptions.length) {
    return (
      <ul className="collection with-header">
        <li className='collection-header transparent componentGradient'>
          <h5 className='color1-text text-lighten-5'>Subscriptions</h5>
        </li>

        { subscriptions.map((sub, i) => {
          return (
            <li key={i} className="collection-item avatar transparent componentGradient">
              <i className={`material-icons circle ${ allColors() }`}>{ allIcons() }</i>
              <Link to={ `${ sub.creatorName + '/' + urlHelper.slugify(sub.title) }` } >
                <h3 className="title">{ checkLength(sub.title, 25) }</h3>
              </Link>
              <p>{ checkLength(sub.description, 40) }
              </p>
              <Link to={ `${ sub.creatorName + '/' + urlHelper.slugify(sub.title) }` } className="secondary-content">
                <i className="material-icons color1-text text-lighten-5">contact_phone</i>
              </Link>
            </li>
          );
        })}


        <li className="collection-header transparent componentGradient">
        <Link to='subscriptions'>
          <strong>All My Subscriptions</strong>
        </Link>
        </li>     
      </ul>
    );
  } else {
    return (
      <ul className='collection with-header'>
        <li className='collection-header transparent componentGradient'>
          <h5 className='color1-text text-lighten-5'>Subscriptions</h5>
        </li>
        <li className="collection-item transparent componentGradient">
          <div>You have no subscriptions. 
            <Link to='/search'>Go search for some!</Link>
          </div>
        </li>
      </ul>
    );
  }

};