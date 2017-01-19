FlattenHTML <- function(fnameIn, fnameOut)
{
  library(XML)
  
  # Read and parse HTML file
  if(!file.exists(fnameIn))
    return(FALSE)
  
  dir = dirname(fnameIn)
  html = htmlTreeParse(fnameIn,useInternal = TRUE)
  top = xmlRoot(html)
  
  # extract all <script> tags with src value
  srcNode=getNodeSet(top, '//script[@src]')
  for (node in srcNode)
  {
    b=xmlAttrs(node)
    f = file.path(dir, b['src'])
    alternateSrc = FindSrcReplacement(f)
    if (!is.null(alternateSrc))
    {
      s = alternateSrc
      names(s)=c('src')
      newNode=xmlNode("script",attrs=s)
      replaceNodes(node, newNode)
    }else{
      str=ReadFileForEmbedding(b['src']);
      if (is.null(str)) continue
      
      newNode=xmlNode("script", str, attrs=c(type="text/javascript"))
      replaceNodes(node, newNode)
    }
  }
  
  # extract all <link> tags with src value
  linkNode=getNodeSet(top, '//link[@href]')
  for (node in linkNode)
  {
    b=xmlAttrs(node)
    f = file.path(dir, b['href'])
    str=ReadFileForEmbedding(f);
    if (is.null(str)) continue
    
    newNode=xmlNode("style", str)
    replaceNodes(node, newNode)
  }
  
  saveXML(html, file=fnameOut)
  return(TRUE)
}

ReadFullFile <- function(fname)
{
  if(!file.exists(fname))
    return(NULL)

  con=file(fname,open="r")
  data = readLines(con)
  close(con)
  return(data)
}

ReadFileForEmbedding <- function(fname)
{
  data = ReadFullFile(fname)
  if (is.null(data))
    return(NULL)

  str = paste(data, collapse ='\n')
  str = paste(cbind('// <![CDATA[', str,'// ]]>'), collapse ='\n')
  return(str)
}

FindSrcReplacement <- function(str)
{
  str <- iconv(str, to="UTF-8")
  pattern = "plotlyjs-(\\w.+)/plotly-latest.min.js"
  match1=regexpr(pattern, str)
  attr(match1, 'useBytes')<-FALSE
  strMatch=regmatches(str, match1, invert = FALSE)
  if (length(strMatch)==0) return(NULL)
  
  pattern2 = "-(\\d.+)/"
  match2 = regexpr(pattern2, strMatch[1])
  attr(match2, 'useBytes')<-FALSE
  s=regmatches(strMatch[1], match2)
  if (length(s)==0) return(NULL)
  
  verstr=substr(s, 2, nchar(s)-1)
  str = paste('https://cdn.plot.ly/plotly-', verstr,'.min.js', sep='')
  return(str)
}

internalSaveWidget <- function(w, fname)
{
  saveWidget(w, file=fname, selfcontained = FALSE)
  FlattenHTML(fname, fname)
}
####################################################################
fname <- 'out.html'

library(htmlwidgets)
library(ggplot2)
library(plotly)
library(dplyr)
library(zoo)

# actual code here
dataset2 <- Values
dataset2 <- aggregate(dataset2, by = list(dataset2$Year), FUN = mean, na.rm = TRUE )

attach(dataset2)
p <- plot_ly(dataset2, x = Year, y = Value)
p <- add_trace(p, y = fitted(loess(Value ~ as.numeric(Year))), x = Year)
p <- layout(p, title = "# Road Accidents (per year)", showlegend = FALSE)
detach(dataset2)
# code end

w = as.widget(p)
internalSaveWidget(w, fname)

#Sys.sleep(20)
####################################################################