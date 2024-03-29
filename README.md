BACKEND NEWS/USERs

Grupo 2: La Rollingneta - Proyecto final Rolling Code School 2022, Comisión 9i

Integrantes: Marina Bianconi, Francisco Terán y Andrea Hongn 

Blog donde se muestran noticias deportivas divididas en cuatro categorías. Consume datos de una API desarrollada por los tres integrantes. La estructura donde se muestran estos datos (Front-End) estuvo a cargo de los tres integrantes. El sitio distingue dos roles: Administrador y Usuario. Cada uno, a partir de renders condicionales, tiene acceso a lugares de la página comunes a ambos y, en otros casos, a lugares propios de cada rol. Por ejemplo, ambos roles pueden acceder al detalle de la noticia, pero sólo el administrador puede editar y destacar las mismas. Por su parte, el usuario tiene la posibilidad de agregar noticias, mediante un click a un corazón, a un carrito de favoritos, el cual se encuentra ubicado en un offcanvas que se despliega por el lado izquierdo de la pantalla. El administrador, a su vez, es el encargado de administrar al conjunto de usuarios registrados. Los datos de estos , almacenados en una base de datos, se muestran en una tabla visible sólo para el administrador. A partir de dicha tabla el administrador puede modificar datos del usuario y, en caso de que sea necesario, eliminarlo. En los sitios sensibles de la página, sitios de conexión entre el Back y el Front, como ser el registro y el login, la página presenta sólidas validaciones para garantizar la seguridad de nuestros usuarios.

Utilizamos Mongo db como base de datos. El back presenta encriptación de contraseñas, TOKENS que expiran cuando pasa un día, solidas validaciones equivalentes a las del FRONT, envío de mails y conexión entre los datos de los favoritos del usuario y las noticias almacenadas, para que en el caso de que el administrador elimine una noticia que algún usuario tenga como favorita, ésta ya no le figure al usuario.

Para finalizar nos gustaría agradecer a la comunidad de Rolling y, especialmente, a nuestro tutor Diego Grassino y a nuestro mentor Andres Perlo, que estuvieron siempre a dispoción nuestra, ayudándonos y dándonos invaluables consejos a lo largo del curso y de los diferentes proyectos que lo conforman.

link deploy back: https://backend-news-eight.vercel.app/
link depploy front: https://proyecto-final-rolling-code-blog.vercel.app/

rutas de interes:

usuarios:
https://backend-news-eight.vercel.app/users/verusuarios
https://backend-news-eight.vercel.app/users/login
https://backend-news-eight.vercel.app/users/register

news:
https://backend-news-eight.vercel.app/news/news
