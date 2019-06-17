import React, {Component} from "react";
import ReactDOM from "react-dom";
import Slider from "react-slick";


import axios from 'axios';
import {CopyToClipboard} from 'react-copy-to-clipboard';


import animatedLogo from "./images/altertago_logo_animated.svg";

class ScriptToCopy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copies: false
    };
  }
  render() {
    const {altTags} = this.props;
    return (
      <div className="flex flex-column w-100 justify-center items-center pv5 fadeIn">
      <h2>Saved ALT descriptions</h2>
      <pre className="tl pa2 w-auto-l w-100 overflow-x-scroll ">{`<script>
const altTags = [${altTags.map(tag => `\n  {"${tag.imgSrc}": "${tag.descr}"}`)}
]
</script>`}</pre>
      <CopyToClipboard text={`<script>
const altTags = [${altTags.map(tag => `\n  {"${tag.imgSrc}": "${tag.descr}"}`)}
]
</script>`}
      onCopy={() => this.setState({copied: true})}>
      <button className="copyButton w-auto-l w-100">
        {this.state.copied ? 'Script is copied!' : 'Copy the script to clipboard'}
      </button>

      </CopyToClipboard>

      {this.state.copied ? <p style={{color: 'green'}}>Script is copied to clipboard! Paste it inside the <head></head> tag in your website</p> : null}
      </div>
    )
  }
}

class AltEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentImgLabel: '',
      activeSlide: 0,
      altTags: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.scrollToScript = this.scrollToScript.bind(this);
  }
  handleChange(event) {
    this.setState({currentImgLabel: event.target.value});
    console.log(event.target.value);

  }
  handleSave(event) {
    event && event.preventDefault();
    const { altTags, currentImgLabel, activeSlide } = this.state;
    const { images } = this.props;
    const index = altTags.findIndex(tag => tag.imgSrc == images[activeSlide]);
    if (index > -1) {
      altTags[index] = {
        imgSrc: images[activeSlide],
        descr: currentImgLabel
      };
    } else {
      altTags.push({
        imgSrc: images[activeSlide],
        descr: currentImgLabel
      });
    }
    this.setState({altTags});
  }
  scrollToScript() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }
  render() {
    const {images, website} = this.props;
    const {currentImgLabel, activeSlide, altTags} = this.state;
    const settings = {
      adapriveHeight: true,
      arrows: true,
      dots: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      beforeChange: (current, next) => {
      this.handleSave();
      const {altTags, activeSlide} = this.state;
      const currentImageSrc = this.props.images[activeSlide];
      const currentAltTag = altTags.filter(tag => tag.imgSrc == currentImageSrc);
      this.setState({ oldSlide: current, activeSlide: next, currentImgLabel: currentAltTag.descr || "" })
      },
      afterChange: current => this.setState({ activeSlide2: current })
    };
    return (
    <div className="flex flex-column mw9 center h-100">
      <div className="flex flex-row-l flex-column items-start justify-center">
        <Slider  {...settings} className=" w-60-l w-100  mh4-l pa4 shadow-4 pa4-l mb5">
          {images.map((image, i) => (
            <div key={i} className="innerSlide flex flex-column items-center justify-center" style={{objectFit: 'contain'}}>
              <img src={image} className="w-auto h-100 center" style={{maxHeight: '55vh'}}/>
            </div>
          ))}
        </Slider>
        <form name="descriptions"
          className="tl w-40-l w-100 pa3 h-100 justify-between"
          onSubmit={this.handleSave}
        >
          <label htmlFor="imageDescription" className="f4 ">
            Describe the image
          </label>
          <p>Image source: <span className="f6 silver break-all">{images[activeSlide]}</span></p>
          <textarea
            name="imageDescription"
            value={currentImgLabel}
            onChange={this.handleChange}
            className="mv3"
          />
          <button type="submit" className="w-100">
            Save
          </button>
          <p className="mt4">
          Unsure what to write?
          </p>
          <p>
          Check out <a
            href="https://www.w3.org/WAI/tutorials/images/decision-tree/"
            target="_blank"
            rel="noopener noreferrer"
            title="Web accessibility tutorials: Alt description decision tree"
          >
            this decision tree
          </a>
          </p>
          {altTags.length > 0 && <p><a onClick={this.scrollToScript}>See saved tags</a></p>}
        </form>
      </div>
      <div ref={el => { this.el = el; }}>
      {altTags.length > 0 && <ScriptToCopy altTags={altTags}/>}
      </div>
    </div>
    );
  }
}

const Loader = () => (
  <div className="flex flex-column items-center justify-center pa4">
    <img src={animatedLogo} className="w-100 mw5 h-auto"/>
    <p style={{color: '#0A4C3F'}}>loading images...</p>
  </div>
);

class AltTagsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: ["https://meduza.io/image/attachments/images/004/196/253/original/9LlM5o9ZZ-6LnAHM7x19FQ.png",
      "https://meduza.io/image/attachments/images/004/197/270/mobile/HKZEZ3sU2sCteYV-Q87ugA.png",
      "https://meduza.io/image/attachments/images/004/196/606/mobile/3ZR8E39jrrU_FRFttQrPYg.jpg",
      "https://meduza.io/image/attachments/images/004/178/932/original/k0dtmNJL92ti0vkJBYkraw.png",
      "https://meduza.io/image/attachments/images/004/194/619/mobile/Kr-5Wnh-PFgJR-kF_SpeTA.png",
      "https://meduza.io/image/attachments/images/004/196/253/original/9LlM5o9ZZ-6LnAHM7x19FQ.png",
      "https://meduza.io/image/attachments/images/004/169/163/original/E3fORMSSWx03GxpdCOCpVQ.png",
      "https://meduza.io/image/attachments/images/004/162/798/original/IYvSTF1VfegaUJKoTTgLGQ.png",
      "https://meduza.io/image/partners/logos/000/000/265/original/__________________.png"
      ],
      website: "",
      loading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  handleChange(event) {
    this.setState({website: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.website);
    this.setState({loading: true});
    event.preventDefault();
    axios.get('https://alt-image-descriptions.herokuapp.com/get-images', {
      params: {
        url: encodeURIComponent(this.state.website)
      }
    })
    .then(response => {
      console.log(response.data);
      this.setState({images: response.data});

    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    const {images, website, loading} = this.state;
    if (!images && !loading) {
      return (
        <form  onSubmit={this.handleSubmit} className="flex flex-column items-center justify-center pv4">
          <div className="inputWrapper w-100 mw6">
            <input  type="url" title="please enter a valid URL starting with https://" value={website} onChange={this.handleChange} required />
            <span className="bottom"></span>
            <span className="right"></span>
            <span className="top"></span>
            <span className="left"></span>
          </div>
          <button className="mt4 w-100 mw6" type="submit">Start describing images!</button>
        </form>
      );
    } else if (!images && loading) {
      return <div className="h-100"><Loader/></div>
    } else {
      return <AltEditor images={images} website={website}/>;
    }
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<AltTagsApp />, mountNode);
