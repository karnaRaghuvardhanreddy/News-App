import { Component } from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import propTypes from "prop-types";

class News extends Component {
  static defaultProps={
    country:"in",
    pageSize:8,
    category:"general",
    author:"",
    date:new Date()
  }


  
  static propTypes={
    country:propTypes.string,
    pageSize:propTypes.number,
    category:propTypes.string
  }

  constructor(props){
    super(props);
    this.state={
      articles:[],
      loading:false,
      page:1,
    }
    this.handlePrevChange = this.handlePrevChange.bind(this);
    this.handleNextChange = this.handleNextChange.bind(this);
  }
  async update(){
    let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c60ad081abd042d3bf037c51f87841c1&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading:true})
    let data=await fetch(url);
    let response=await data.json();
    this.setState({articles:response.articles,totalArticles:response.totalResults,loading:false});
  }
  async componentDidMount(){
    this.update();
  }
  async handlePrevChange(){
    this.setState({page:this.state.page-1});
    this.update();
  }
  async handleNextChange(){
    this.setState(prevState => ({
      page: prevState.page + 1
    }));
    this.update();
  }
    render() {
      return (
        <div className="container my-3">
          <h1 className="text-center">NewsMonkey-Top Headlines</h1>
          {this.state.loading &&<Spinner/>}
          <div className="row">
            {!this.state.loading && this.state.articles.map((article, index) => (
              <div className="col-md-4" key={index}>
                <NewsItem
                  title={article.title}
                  description={article.description}
                  imageUrl={article.urlToImage}
                  newsUrl={article.url}
                  author={article.author?article.author:"unknown author"} 
                  date={article.publishedAt}
                  source={article.source.name}
                />
              </div>
            ))}
          </div>
          <div className="container d-flex justify-content-between">
          <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevChange}>&larr;Previous</button>
          <button disabled={this.state.page+1>Math.ceil(this.state.totalArticles/this.props.pageSize)} type="button" className="btn btn-dark " onClick={this.handleNextChange}>Next&rarr;</button>
          </div>
        </div>
      );
    }
}

export default News