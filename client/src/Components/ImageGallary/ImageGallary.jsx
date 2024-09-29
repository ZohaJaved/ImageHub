import React,{useEffect, useState} from 'react'
import Navbar from '../Navbar/Navbar'
import {useSelector ,useDispatch } from 'react-redux';
import { FetchImage,IncrementViewCount } from '../../state/slicer.js';
import "./ImageGallary.css"


export default function ImageGallary() {
    const [visibleImages, setVisibleImages] = useState({});



    const handleViewImage = (id) => {
        //Increment function is called only when view button is pressed
        if (!visibleImages[id]) {
            dispatch(IncrementViewCount(id));
            dispatch(FetchImage());
        }
        setVisibleImages(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };
    
    const dispatch=useDispatch();
    const ImageGallary=useSelector((state)=>state?.images?.ImageGallary)
    console.log("images===",ImageGallary)

    useEffect(() => {
        dispatch(FetchImage());
        console.log("ImageGallary===",ImageGallary)
    }, [dispatch,visibleImages]);

  return (
    <>
      <Navbar showExtraLinks={true}/>
      <div className="image-container">
      <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Views</th>
                </tr>
            </thead>
            <tbody>
                {ImageGallary&&ImageGallary.map(image => (
                    <tr key={image._id}>
                        <td>
                            <div>
                                {visibleImages[image._id] && (
                                    <img src={image.imageUrl} alt={image.title} style={{ width: '100px' }} />
                                )}
                                <button onClick={() => handleViewImage(image._id)}>
                                    {visibleImages[image._id] ? 'Hide Image' : 'View Image'}
                                </button>
                            </div>
                        </td>
                        <td>{image.title}</td>
                        <td>{image.description}</td>
                        <td>{image.viewCount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </>
  )
}
